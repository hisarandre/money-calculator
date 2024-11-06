package com.moneycalculator.back.services;
import com.moneycalculator.back.dto.TransactionDTO;
import com.moneycalculator.back.models.Transaction;

import java.util.List;

public interface TransactionService {

    List<Transaction> getAllTransactions();

    List<Transaction> getTransactionsByType(String type);

    Transaction getTransactionById(Integer id);

    Transaction addTransaction(TransactionDTO transaction);

    Transaction updateTransaction(Integer id, Transaction transaction);

    void deleteTransaction(Integer id);
}