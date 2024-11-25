package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.*;
import com.moneycalculator.back.models.Budget;
import com.moneycalculator.back.models.DailyExpense;
import com.moneycalculator.back.models.FixedExpense;

import java.util.List;

public interface DailyExpenseService {

    List<DailyExpense> getAllDailyExpense();

    Double calculateTotalExpense(List<DailyExpense> expenses);

    DailyExpenseListDTO getDailyExpensePerWeek(Integer number);

}
