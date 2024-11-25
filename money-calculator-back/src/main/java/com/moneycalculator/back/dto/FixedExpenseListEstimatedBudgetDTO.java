package com.moneycalculator.back.dto;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FixedExpenseListEstimatedBudgetDTO {

    private Double mainCurrencyCurrentWallet;

    private Double secondaryCurrencyCurrentWallet;

    private Double estimatedBudget;

    private Double mainCurrencyTotalExpenses;

    private Double secondaryCurrencyTotalExpenses;

    private List<FixedExpenseDTO> fixedExpenses;

}
