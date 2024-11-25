package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.*;
import com.moneycalculator.back.models.Budget;
import com.moneycalculator.back.models.DailyExpense;
import com.moneycalculator.back.models.FixedExpense;
import com.moneycalculator.back.models.MapstructMapper;
import com.moneycalculator.back.repositories.BudgetRepository;
import com.moneycalculator.back.repositories.DailyExpenseRepository;
import com.moneycalculator.back.repositories.FixedExpenseRepository;
import com.moneycalculator.back.utils.BigDecimalUtils;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.temporal.TemporalAdjusters;


import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class DailyExpenseServiceImpl implements DailyExpenseService {

    private final DailyExpenseRepository dailyExpenseRepository;
    private final BudgetRepository budgetRepository;
    private final BudgetServiceImpl budgetService;
    private final FixedExpenseServiceImpl fixedExpenseService;
    private final FixedExpenseRepository fixedExpenseRepository;
    private final CurrencyConversionService currencyConversionService;
    private final MapstructMapper mapper = Mappers.getMapper(MapstructMapper.class);

    @Autowired
    public DailyExpenseServiceImpl(DailyExpenseRepository dailyExpenseRepository,
                                   BudgetRepository budgetRepository,
                                   BudgetServiceImpl budgetService,
                                   FixedExpenseRepository fixedExpenseRepository,
                                   FixedExpenseServiceImpl fixedExpenseService,
                                   CurrencyConversionService currencyConversionService) {
        this.dailyExpenseRepository = dailyExpenseRepository;
        this.fixedExpenseService = fixedExpenseService;
        this.fixedExpenseRepository = fixedExpenseRepository;
        this.currencyConversionService = currencyConversionService;
        this.budgetRepository = budgetRepository;
        this.budgetService = budgetService;

    }

    @Override
    public List<DailyExpense> getAllDailyExpense() {
        return dailyExpenseRepository.findAll();
    }

    @Override
    public DailyExpenseListDTO getDailyExpensePerWeek(Integer number) {
        LocalDate currentDate = LocalDate.now();
        currentDate = currentDate.plusDays(number * 7L);

        LocalDate startOfWeek = currentDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = currentDate.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        List<FixedExpense> fixedExpenses = fixedExpenseRepository.findAll();
        List<DailyExpense> dailyExpenses = dailyExpenseRepository.findDailyExpensesByDateBetween(startOfWeek, endOfWeek);
        List<DailyExpenseSavingDTO> dailyExpensesDto = mapper.dailyExpenseToDTOs(dailyExpenses);
        Budget budget = budgetRepository.findById(1)
                .orElseThrow(() -> new IllegalArgumentException("No budget found."));

        Double totalDailyExpense = calculateTotalExpense(dailyExpenses);
        Double totalFixedExpense = fixedExpenseService.calculateTotalExpense(budget, fixedExpenses);
        Double estimatedBudget = budgetService.calculateEstimatedBudgetPerDay(budget, totalFixedExpense);

        Double totalSaving = 0.0;
        for (DailyExpenseSavingDTO expenseDto : dailyExpensesDto) {
            Double saving = estimatedBudget - expenseDto.getAmount();
            totalSaving = totalSaving + saving;
            expenseDto.setSaving(saving);
        }

        Double currentWallet = totalDailyExpense + totalFixedExpense;
        Double convertedCurrentWallet = budgetService.calculateConvertedAmountFromBudget(budget, currentWallet);

        DailyExpenseListDTO dailyExpenseListDTO = new DailyExpenseListDTO();
        dailyExpenseListDTO.setDailyExpenses(dailyExpensesDto);
        dailyExpenseListDTO.setMainCurrencyCurrentWallet(currentWallet);
        dailyExpenseListDTO.setSecondaryCurrencyCurrentWallet(convertedCurrentWallet);
        dailyExpenseListDTO.setTotal(totalDailyExpense);
        dailyExpenseListDTO.setTotalSaving(totalSaving);

        return dailyExpenseListDTO;
    }


    @Override
    public Double calculateTotalExpense(List<DailyExpense> dailyExpenses){
        BigDecimal total = dailyExpenses.stream()
                .map(expense -> BigDecimal.valueOf(expense.getAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return total.doubleValue();
    }


}
