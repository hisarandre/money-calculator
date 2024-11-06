package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.TransactionDTO;
import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.models.Transaction;
import com.moneycalculator.back.repositories.AccountRepository;
import com.moneycalculator.back.repositories.TransactionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.NoSuchElementException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionServiceImpl implements TransactionService{

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Autowired
    public TransactionServiceImpl(AccountRepository accountRepository,
                                  TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public List<Transaction> getTransactionsByType(String type) {
        Optional<List<Transaction>> existingTransactions = transactionRepository.findByType(type);

        return existingTransactions.orElse(Collections.emptyList());
    }

    public Transaction getTransactionById(Integer id) {
        return transactionRepository.findById(id).orElse(null);
    }

    @Transactional
    public Transaction addTransaction(TransactionDTO transactionDTO) {
        // Check for duplicates
        Optional<Transaction> existingTransaction = transactionRepository.findByLabelAndAccount_Id(
                transactionDTO.getLabel(),
                transactionDTO.getAccountId()
        );

        if (existingTransaction.isPresent()) {
            throw new IllegalArgumentException("A transaction with this label and account already exists.");
        }

        Account account = accountRepository.findById(transactionDTO.getAccountId())
                .orElseThrow(() -> new NoSuchElementException("Account not found for id: " + transactionDTO.getAccountId()));

        Transaction transaction = new Transaction();
        transaction.setLabel(transactionDTO.getLabel());
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setType(transactionDTO.getType());
        transaction.setAccount(account);

        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(Integer id, Transaction transaction) {
        if (transactionRepository.existsById(id)) {
            transaction.setId(id);
            return transactionRepository.save(transaction);
        }
        return null;
    }

    public void deleteTransaction(Integer id) {

        if (!transactionRepository.existsById(id)) {
            throw new EntityNotFoundException("Transaction not found with ID: " + id);
        }

        transactionRepository.deleteById(id);
    }
}
