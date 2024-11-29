package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.BudgetDTO;
import com.moneycalculator.back.dto.BudgetLabelAmountDateDTO;
import com.moneycalculator.back.models.Budget;

public interface BudgetService {

    BudgetDTO getBudget();

    void resetBudget(Budget budget);

    void updateBudget(BudgetLabelAmountDateDTO budget);

    Double calculateEstimatedBudgetPerDay(Budget budget, Double totalFixedExpense);

    Double calculateConvertedAmountFromBudget(Budget budget, Double amount);
}
