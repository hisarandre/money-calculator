package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.TransactionDTO;
import com.moneycalculator.back.dto.TransactionTotalDTO;
import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.models.Expense;
import com.moneycalculator.back.models.Income;
import com.moneycalculator.back.models.Transaction;
import com.moneycalculator.back.repositories.AccountRepository;
import com.moneycalculator.back.repositories.TransactionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

    public TransactionTotalDTO getTransactionsByType(String type) {
        List<Transaction> transactions = transactionRepository.findByType(type)
                .orElse(Collections.emptyList());


        // Calculate the total amount
        BigDecimal totalAmount = transactions.stream()
                .map(transaction -> BigDecimal.valueOf(transaction.getAmount()))  // Convert Double to BigDecimal
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        TransactionTotalDTO transactionsTotal = new TransactionTotalDTO();
        transactionsTotal.setTransactions(transactions);
        transactionsTotal.setTotal(totalAmount.doubleValue());

        return transactionsTotal;
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

        BigDecimal roundedAmount = BigDecimal.valueOf(transactionDTO.getAmount())
                .setScale(2, RoundingMode.HALF_UP);

        Account account = accountRepository.findById(transactionDTO.getAccountId())
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

        // Instantiate the specific subclass based on the type
        Transaction transaction;

        if ("income".equalsIgnoreCase(transactionDTO.getType())) {
            transaction = new Income();
        } else if ("expense".equalsIgnoreCase(transactionDTO.getType())) {
            transaction = new Expense();
        } else {
            throw new IllegalArgumentException("Invalid transaction type: " + transactionDTO.getType());
        }

        transaction.setLabel(transactionDTO.getLabel());
        transaction.setAmount(roundedAmount.doubleValue());
        transaction.setAccount(account);
        transaction.setType(transactionDTO.getType());

        // Save and re-fetch to populate `type`
        Transaction savedTransaction = transactionRepository.save(transaction);

        // Re-fetch the transaction to ensure `type` is populated
        return transactionRepository.findById(savedTransaction.getId())
                .orElseThrow(() -> new IllegalStateException("Transaction not found after save"));
    }

    public Transaction updateTransaction(Integer id, TransactionDTO transaction) {
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found"));

        //round fee
        BigDecimal roundedFee = new BigDecimal(transaction.getAmount())
                .setScale(2, RoundingMode.HALF_UP);

        if (!transaction.getAccountId().equals(existingTransaction.getAccount().getId())) {
            Account newAccount = accountRepository.findById(transaction.getAccountId())
                    .orElseThrow(() -> new EntityNotFoundException("Account not found"));
            existingTransaction.setAccount(newAccount);
        }

        existingTransaction.setLabel(transaction.getLabel());
        existingTransaction.setAmount(roundedFee.doubleValue());

        return transactionRepository.save(existingTransaction);

    }

    public void deleteTransaction(Integer id) {

        if (!transactionRepository.existsById(id)) {
            throw new EntityNotFoundException("Transaction not found");
        }

        transactionRepository.deleteById(id);
    }
}
