package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.TransactionDTO;
import com.moneycalculator.back.dto.TransactionIdTypeTotalDTO;
import com.moneycalculator.back.dto.TransactionListTotalDTO;
import com.moneycalculator.back.dto.TransactionTotalDTO;
import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.models.Expense;
import com.moneycalculator.back.models.Income;
import com.moneycalculator.back.models.Transaction;
import com.moneycalculator.back.repositories.AccountRepository;
import com.moneycalculator.back.repositories.TransactionRepository;
import com.moneycalculator.back.utils.BigDecimalUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

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

    public TransactionListTotalDTO getTransactionsByType(String type) {
        List<Transaction> transactions = transactionRepository.findByType(type)
                .orElse(Collections.emptyList());

        BigDecimal totalAmount = calculateTotalAmount(transactions);

        TransactionListTotalDTO transactionsTotal = new TransactionListTotalDTO();
        transactionsTotal.setTransactions(transactions);
        transactionsTotal.setTotal(totalAmount.doubleValue());

        return transactionsTotal;
    }


    @Transactional
    public TransactionTotalDTO addTransaction(TransactionDTO transactionDTO) {
        // Check for duplicates
        Optional<Transaction> existingTransaction = transactionRepository.findByLabelAndAccount_Id(
                transactionDTO.getLabel(),
                transactionDTO.getAccountId()
        );

        if (existingTransaction.isPresent()) {
            throw new IllegalArgumentException("A transaction with this label and account already exists.");
        }

        BigDecimal roundedAmount = BigDecimalUtils.roundToTwoDecimalPlaces(transactionDTO.getAmount());

        Account account = accountRepository.findById(transactionDTO.getAccountId())
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));

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

        Transaction savedTransaction = transactionRepository.save(transaction);

        List<Transaction> transactions = transactionRepository.findByType(transactionDTO.getType())
                .orElse(Collections.emptyList());

        BigDecimal totalAmount = calculateTotalAmount(transactions);

        TransactionTotalDTO transactionTotal = new TransactionTotalDTO();
        transactionTotal.setTransaction(savedTransaction);
        transactionTotal.setTotal(totalAmount.doubleValue());

        return transactionTotal;
    }


    public TransactionTotalDTO updateTransaction(Integer id, TransactionDTO transaction) {
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found"));

        BigDecimal roundedAmount = BigDecimalUtils.roundToTwoDecimalPlaces(transaction.getAmount());

        if (!transaction.getAccountId().equals(existingTransaction.getAccount().getId())) {
            Account newAccount = accountRepository.findById(transaction.getAccountId())
                    .orElseThrow(() -> new EntityNotFoundException("Account not found"));
            existingTransaction.setAccount(newAccount);
        }

        existingTransaction.setLabel(transaction.getLabel());
        existingTransaction.setAmount(roundedAmount.doubleValue());

        Transaction savedTransaction = transactionRepository.save(existingTransaction);

        List<Transaction> transactions = transactionRepository.findByType(transaction.getType())
                .orElse(Collections.emptyList());

        BigDecimal totalAmount = calculateTotalAmount(transactions);

        TransactionTotalDTO transactionTotal = new TransactionTotalDTO();
        transactionTotal.setTransaction(savedTransaction);
        transactionTotal.setTotal(totalAmount.doubleValue());

        return transactionTotal;
    }

    public TransactionIdTypeTotalDTO deleteTransaction(Integer id) {

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found"));

        String transactionType = transaction.getType();

        transactionRepository.deleteById(id);

        List<Transaction> transactions = transactionRepository.findByType(transactionType)
                .orElse(Collections.emptyList());

        BigDecimal totalAmount = calculateTotalAmount(transactions);

        TransactionIdTypeTotalDTO transactionIdTotal = new TransactionIdTypeTotalDTO();
        transactionIdTotal.setId(id);
        transactionIdTotal.setType(transactionType);
        transactionIdTotal.setTotal(totalAmount.doubleValue());

        return transactionIdTotal;
    }



    public BigDecimal calculateTotalAmount(List<Transaction> transactions) {
        return transactions.stream()
                .map(transaction -> BigDecimal.valueOf(transaction.getAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
