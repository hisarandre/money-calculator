package com.moneycalculator.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FixedExpenseTotalDTO {

    private FixedExpenseDTO fixedExpense;

    private Double estimatedBudget;

    private Double mainCurrencyTotalExpenses;

    private Double secondaryCurrencyTotalExpenses;
}
