package com.moneycalculator.back.services;
import com.moneycalculator.back.dto.*;
import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.models.Budget;
import com.moneycalculator.back.models.FixedExpense;

import java.math.BigDecimal;
import java.util.List;

public interface FixedExpenseService {

    FixedExpenseListEstimatedBudgetDTO getAllFixedExpenses();

    FixedExpenseTotalDTO addFixedExpense(FixedExpenseLabelAmountFrequencyDTO fixedExpenseLabelAmountFrequencyDTO);
/*

    Account updateAccount(Integer _id, Account account);

    void deleteAccount(Integer _id);
*/

    Double calculateEstimatedBudgetPerDay(Budget budget, Double totalExpenses);

    Double calculateTotalExpense(Budget budget, List<FixedExpense> expenses);

}
