package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.AccountLabelFeeDTO;
import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.repositories.AccountRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

import java.util.List;
import java.util.Optional;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    @Autowired
    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    @Override
    public Account addAccount(AccountLabelFeeDTO accountLabelFeeDTO) {
        // Check for duplicates
        Optional<Account> existingAccount = accountRepository.findByLabel(accountLabelFeeDTO.getLabel());

        if (existingAccount.isPresent()) {
            throw new IllegalArgumentException("An account with this label already exists.");
        }

        //round fee
        BigDecimal roundedFee = new BigDecimal(accountLabelFeeDTO.getFee())
                .setScale(2, RoundingMode.HALF_UP);

        Account account = new Account();
        account.setLabel(accountLabelFeeDTO.getLabel());
        account.setFee(roundedFee.doubleValue());

        return accountRepository.save(account);
    }

    @Override
    public Account updateAccount(Integer id, Account account) {
        Account existingAccount = accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with ID: " + id));

        //round fee
        BigDecimal roundedFee = new BigDecimal(account.getFee())
                .setScale(2, RoundingMode.HALF_UP);

        existingAccount.setLabel(account.getLabel());
        existingAccount.setFee(roundedFee.doubleValue());

        return accountRepository.save(existingAccount);
    }

    @Override
    public void deleteAccount(Integer id) {
        if (!accountRepository.existsById(id)) {
            throw new EntityNotFoundException("Account not found");
        }
        accountRepository.deleteById(id);
    }
}
