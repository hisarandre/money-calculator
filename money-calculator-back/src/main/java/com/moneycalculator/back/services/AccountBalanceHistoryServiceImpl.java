package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.AccountBalanceDTO;
import com.moneycalculator.back.dto.AccountBalanceHistoryDTO;
import com.moneycalculator.back.models.AccountBalanceHistory;
import com.moneycalculator.back.models.MapstructMapper;
import com.moneycalculator.back.repositories.AccountBalanceHistoryRepository;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountBalanceHistoryServiceImpl implements AccountBalanceHistoryService{

    private final AccountBalanceHistoryRepository accountBalanceHistoryRepository;
    private final MapstructMapper mapper = Mappers.getMapper(MapstructMapper.class);

    @Autowired
    public AccountBalanceHistoryServiceImpl(AccountBalanceHistoryRepository accountBalanceHistoryRepository) {
        this.accountBalanceHistoryRepository = accountBalanceHistoryRepository;
    }

    //TODO: better optimisation (using only the accountBalance and rendering only the id for the account balance history inside
    @Override
    public List<AccountBalanceHistoryDTO> getAll() {
        List<AccountBalanceHistory> accountBalanceHistories = getAccountBalanceHistoriesFromLast12Months();
        List<AccountBalanceHistoryDTO> accountBalanceHistoriesDTO = new ArrayList<>();

        for (AccountBalanceHistory history : accountBalanceHistories) {

            AccountBalanceHistoryDTO historyDTO = mapper.accountBalanceHistoryToDto(history);

            List<AccountBalanceDTO> accountBalanceDTOs = history.getAccountBalances().stream()
                    .map(mapper::accountBalanceToDto)
                    .collect(Collectors.toList());

            historyDTO.setAccountBalances(accountBalanceDTOs);
            accountBalanceHistoriesDTO.add(historyDTO);
        }
        return accountBalanceHistoriesDTO;
    }

    @Override
    public List<AccountBalanceHistory> getAccountBalanceHistoriesFromLast12Months() {
        LocalDate today = LocalDate.now();
        LocalDate startOfCurrentMonth = today.withDayOfMonth(1);
        LocalDate startDate = startOfCurrentMonth.minusMonths(12);

        return accountBalanceHistoryRepository.findAllFromLast12Months(startDate);
    }
}
