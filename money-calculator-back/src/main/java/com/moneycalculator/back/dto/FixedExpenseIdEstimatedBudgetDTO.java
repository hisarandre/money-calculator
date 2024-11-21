package com.moneycalculator.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FixedExpenseIdEstimatedBudgetDTO {

    private Double estimatedBudget;

    private Double mainCurrencyTotalExpenses;

    private Double secondaryCurrencyTotalExpenses;

    private Integer id;
}
