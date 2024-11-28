package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.*;
import com.moneycalculator.back.models.Budget;
import com.moneycalculator.back.models.DailyExpense;
import com.moneycalculator.back.models.FixedExpense;
import org.springframework.data.util.Pair;

import java.time.LocalDate;
import java.util.List;

public interface DailyExpenseService {

    List<DailyExpenseCalendarDTO> getDailyExpenseCalendar();

    List<DailyExpense> getAllDailyExpense();

    Double calculateTotalExpense(List<DailyExpense> expenses);

    DailyExpenseListDTO getDailyExpensePerWeek(Integer number);

    Pair<LocalDate, LocalDate> calculateStartEndDate(Budget budget, int number);

    Pair<Boolean, Boolean> calculateNextAndPreviousWeek(Budget budget,LocalDate startOfWeek, LocalDate endOfWeek);

    List<DailyExpenseSavingDTO> generateEmptyDailyExpense(Budget budget, List<DailyExpenseSavingDTO> existingDailyExpenses, LocalDate startOfWeek, LocalDate endOfWeek);

}
