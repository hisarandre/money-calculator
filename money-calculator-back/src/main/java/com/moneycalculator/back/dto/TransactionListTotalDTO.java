package com.moneycalculator.back.dto;

import com.moneycalculator.back.models.Transaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionListTotalDTO {

    private List<Transaction> transactions;

    private Double total;

}
