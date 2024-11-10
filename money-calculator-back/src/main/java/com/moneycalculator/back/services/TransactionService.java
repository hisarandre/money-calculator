package com.moneycalculator.back.services;
import com.moneycalculator.back.dto.TransactionDTO;
import com.moneycalculator.back.dto.TransactionIdTotalDTO;
import com.moneycalculator.back.dto.TransactionListTotalDTO;
import com.moneycalculator.back.dto.TransactionTotalDTO;
import com.moneycalculator.back.models.Transaction;

import java.math.BigDecimal;
import java.util.List;

public interface TransactionService {

    List<Transaction> getAllTransactions();

    TransactionListTotalDTO getTransactionsByType(String type);

    TransactionTotalDTO addTransaction(TransactionDTO transaction);

    TransactionTotalDTO updateTransaction(Integer id, TransactionDTO transaction);

    TransactionIdTotalDTO deleteTransaction(Integer id);

    BigDecimal calculateTotalAmount(List<Transaction> transactions);
}