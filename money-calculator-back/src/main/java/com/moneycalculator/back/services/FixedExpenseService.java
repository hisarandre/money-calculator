package com.moneycalculator.back.services;
import com.moneycalculator.back.dto.*;
import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.models.Budget;
import com.moneycalculator.back.models.DailyExpense;
import com.moneycalculator.back.models.FixedExpense;

import java.math.BigDecimal;
import java.util.List;

public interface FixedExpenseService {

    FixedExpenseListEstimatedBudgetDTO getAllFixedExpenses();

    FixedExpenseTotalDTO addFixedExpense(FixedExpenseLabelAmountFrequencyDTO fixedExpenseLabelAmountFrequencyDTO);

    FixedExpenseTotalDTO updateFixedExpense(Integer id, FixedExpenseLabelAmountFrequencyDTO fixedExpenseLabelAmountFrequencyDTO);

    FixedExpenseIdEstimatedBudgetDTO deleteFixedExpense(Integer id);

    Double calculateTotalExpense(Budget budget, List<FixedExpense> expenses);

    FixedExpenseTotalDTO convertExpenseToExpenseWithTotal(FixedExpense fixedExpense);

    Double calculateCurrentWallet(Double totalExpenses);

    Double calculateTotalDailyExpense(List<DailyExpense> dailyExpenses);
}
