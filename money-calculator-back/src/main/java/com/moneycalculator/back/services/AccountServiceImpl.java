package com.moneycalculator.back.services;

import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.repositories.AccountRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public Account addAccount(Account account) {
        // Check for duplicates
        Optional<Account> existingAccount = accountRepository.findByLabel(account.getLabel());

        if (existingAccount.isPresent()) {
            throw new IllegalArgumentException("An account with this label already exists.");
        }

        return accountRepository.save(account);
    }

    @Override
    public Account updateAccount(Integer id, Account account) {
        Account existingAccount = accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with ID: " + id));

        existingAccount.setLabel(account.getLabel());
        existingAccount.setFee(account.getFee());
        // Update other fields as needed

        return accountRepository.save(existingAccount);
    }

    @Override
    public void deleteAccount(Integer id) {
        if (!accountRepository.existsById(id)) {
            throw new EntityNotFoundException("Account not found with ID: " + id);
        }
        accountRepository.deleteById(id);
    }


}
