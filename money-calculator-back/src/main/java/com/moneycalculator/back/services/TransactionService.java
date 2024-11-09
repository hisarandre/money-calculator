package com.moneycalculator.back.services;
import com.moneycalculator.back.dto.TransactionDTO;
import com.moneycalculator.back.dto.TransactionTotalDTO;
import com.moneycalculator.back.models.Transaction;

import java.util.List;

public interface TransactionService {

    List<Transaction> getAllTransactions();

    TransactionTotalDTO getTransactionsByType(String type);

    Transaction addTransaction(TransactionDTO transaction);

    Transaction updateTransaction(Integer id, TransactionDTO transaction);

    void deleteTransaction(Integer id);
}