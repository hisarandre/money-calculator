package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.AccountBalanceDTO;
import com.moneycalculator.back.models.*;
import com.moneycalculator.back.repositories.AccountBalanceHistoryRepository;
import com.moneycalculator.back.repositories.AccountBalanceRepository;
import com.moneycalculator.back.repositories.AccountRepository;
import com.moneycalculator.back.repositories.TransactionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.factory.Mappers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static com.moneycalculator.back.utils.BigDecimalUtils.roundToTwoDecimalPlaces;

@Service
public class AccountBalanceHistoryServiceImpl implements AccountBalanceHistoryService{

    private static final Logger log = LoggerFactory.getLogger(AccountBalanceHistoryServiceImpl.class);
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final AccountBalanceRepository accountBalanceRepository;
    private final AccountBalanceHistoryRepository accountBalanceHistoryRepository;
    private final MapstructMapper mapper = Mappers.getMapper(MapstructMapper.class);

    @Autowired
    public AccountBalanceHistoryServiceImpl(TransactionRepository transactionRepository,
                                            AccountRepository accountRepository,
                                            AccountBalanceRepository accountBalanceRepository,
                                            AccountBalanceHistoryRepository accountBalanceHistoryRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.accountBalanceRepository = accountBalanceRepository;
        this.accountBalanceHistoryRepository = accountBalanceHistoryRepository;
    }

    @Override
    public List<AccountBalanceHistory> getAll() {
        return getAccountBalanceHistoriesFromLast12Months();
    }

    @Override
    public List<AccountBalanceHistory> getAccountBalanceHistoriesFromLast12Months() {
        LocalDate today = LocalDate.now();
        LocalDate startOfCurrentMonth = today.withDayOfMonth(1);
        LocalDate startDate = startOfCurrentMonth.minusMonths(12);

        return accountBalanceHistoryRepository.findAllFromLast12Months(startDate);
    }

    @Override
    public boolean checkMonthlyDone(){
        LocalDate today = LocalDate.now();
        LocalDate startOfCurrentMonth = today.withDayOfMonth(1);

        int count = accountBalanceHistoryRepository.countByDate(startOfCurrentMonth);

        if (count > 1) {
            throw new IllegalStateException("There should only be one or none AccountBalanceHistory for today");
        }

        return count != 0;
    }

    @Override
    public AccountBalanceHistory addAccountBalanceHistory(List<AccountBalanceDTO> accountBalanceDTOs) {
        LocalDate today = LocalDate.now();
        LocalDate startOfCurrentMonth = today.withDayOfMonth(1);


        int count = accountBalanceHistoryRepository.countByDate(startOfCurrentMonth);
        if (count == 1) {
            throw new IllegalStateException("An account balance already exist for this month");
        }

        for (AccountBalanceDTO dto : accountBalanceDTOs) {
            dto.setAmount(roundToTwoDecimalPlaces(dto.getAmount()));
        }

        Double total = calculateAccountTotalAmount(accountBalanceDTOs);
        Double earning = calculateAccountEarningAmount(total);

        AccountBalanceHistory accountBalanceHistory = new AccountBalanceHistory();
        accountBalanceHistory.setDate(startOfCurrentMonth);
        accountBalanceHistory.setTotal(total);
        accountBalanceHistory.setEarning(earning);


        accountBalanceHistory = accountBalanceHistoryRepository.save(accountBalanceHistory);
        List<AccountBalance> accountBalances = new ArrayList<>();

        for (AccountBalanceDTO dto : accountBalanceDTOs) {
            Account account = accountRepository.findById(dto.getAccountId())
                    .orElseThrow(() -> new EntityNotFoundException("Account not found"));

            AccountBalance accountBalance = new AccountBalance();
            accountBalance.setAccountBalanceHistoryId(accountBalanceHistory.getId());
            accountBalance.setAccount(account);
            accountBalance.setAmount(roundToTwoDecimalPlaces(dto.getAmount()));

            accountBalances.add(accountBalance);
            accountBalanceRepository.save(accountBalance);
        }

        accountBalanceHistory.setAccountBalances(accountBalances);

        return accountBalanceHistory;
    }

    @Override
    public Double calculateAccountTotalAmount(List<AccountBalanceDTO> accountBalanceDTOs) {
        BigDecimal total = accountBalanceDTOs.stream()
                .map(balance -> BigDecimal.valueOf(balance.getAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return total.doubleValue();
    }

    @Override
    public Double calculateAccountEarningAmount(Double total) {
        LocalDate today = LocalDate.now();
        AccountBalanceHistory accountBalanceHistory = accountBalanceHistoryRepository.findTopByOrderByDateDesc();

        if (accountBalanceHistory != null) {
            Double earning = total - accountBalanceHistory.getTotal();
            return roundToTwoDecimalPlaces(earning);
        }
        return 0.0;
    }

    @Override
    public Double calculateProjectedAmount(LocalDate date) {
        AccountBalanceHistory lastBalanceHistory = accountBalanceHistoryRepository.findFirstByOrderByDateDesc();

        if (lastBalanceHistory == null) {
            throw new EntityNotFoundException("No previous AccountBalanceHistory found.");
        }

        LocalDate currentMonth = lastBalanceHistory.getDate();
        List<AccountBalance> accountBalances = lastBalanceHistory.getAccountBalances();
        List<Transaction> transactions = transactionRepository.findAll();

        while (currentMonth.isBefore(date)) {

            // Calculate the savings from the fee
            for (AccountBalance accountBalance : accountBalances) {
                Double fee = accountBalance.getAccount().getFee();
                Double amount = accountBalance.getAmount();
                double monthlyRate = fee / 12;
                accountBalance.setAmount(amount + (amount * (monthlyRate / 100)));
            }

            // Subtract all expenses
            for (Transaction transaction : transactions) {
                if ("expense".equals(transaction.getType())) {
                    for (AccountBalance accountBalance : accountBalances) {
                        if (accountBalance.getAccount().getId().equals(transaction.getAccount().getId())) {
                            accountBalance.setAmount(accountBalance.getAmount() - transaction.getAmount());
                        }
                    }
                }

                if ("income".equals(transaction.getType())) {
                    for (AccountBalance accountBalance : accountBalances) {
                        if (accountBalance.getAccount().getId().equals(transaction.getAccount().getId())) {
                            accountBalance.setAmount(accountBalance.getAmount() + transaction.getAmount());
                        }
                    }
                }
            }

            // Move to the next month
            currentMonth = currentMonth.plusMonths(1);
        }

        double total = 0.0;

        for (AccountBalance accountBalance : accountBalances) {
            total += accountBalance.getAmount();
        }

        return roundToTwoDecimalPlaces(total);
    }
}
