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
import org.springframework.data.util.Pair;
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
    public List<DailyExpenseCalendarDTO> getDailyExpenseCalendar(){

        List<DailyExpense> dailyExpenses = dailyExpenseRepository.findAll();
        return mapper.dailyExpenseToCalendarDTOs(dailyExpenses);
    }

    @Override
    public DailyExpenseListDTO getDailyExpensePerWeek(Integer number) {
        Budget budget = budgetRepository.findById(1)
                .orElseThrow(() -> new IllegalArgumentException("No budget found."));

        Pair<LocalDate, LocalDate> dateRange = calculateStartEndDate(budget, number);
        Pair<Boolean, Boolean> nextPreviousWeek = calculateNextAndPreviousWeek(budget, dateRange.getFirst(), dateRange.getSecond());

        List<FixedExpense> fixedExpenses = fixedExpenseRepository.findAll();
        List<DailyExpense> dailyExpenses = dailyExpenseRepository.findDailyExpensesByDateBetween(dateRange.getFirst(), dateRange.getSecond());
        List<DailyExpenseSavingDTO> dailyExpensesDto = mapper.dailyExpenseToDTOs(dailyExpenses);

        Double totalDailyExpense = calculateTotalExpense(dailyExpenses);
        Double totalFixedExpense = fixedExpenseService.calculateTotalExpense(budget, fixedExpenses);
        Double estimatedBudget = budgetService.calculateEstimatedBudgetPerDay(budget, totalFixedExpense);

        Double totalSaving = 0.0;
        for (DailyExpenseSavingDTO expenseDto : dailyExpensesDto) {
            Double saving = BigDecimalUtils.roundToTwoDecimalPlaces(estimatedBudget - expenseDto.getAmount());
            totalSaving = totalSaving + saving;
            expenseDto.setSaving(saving);
        }

        List<DailyExpenseSavingDTO> emptyDailyExpenses = generateEmptyDailyExpense(budget, dailyExpensesDto, dateRange.getFirst(), dateRange.getSecond());
        dailyExpensesDto.addAll(emptyDailyExpenses);
        dailyExpensesDto.sort(Comparator.comparing(DailyExpenseSavingDTO::getDate));

        Double currentWallet = totalDailyExpense + totalFixedExpense;
        Double convertedCurrentWallet = budgetService.calculateConvertedAmountFromBudget(budget, currentWallet);

        DailyExpenseListDTO dailyExpenseListDTO = new DailyExpenseListDTO();
        dailyExpenseListDTO.setDailyExpenses(dailyExpensesDto);
        dailyExpenseListDTO.setMainCurrencyCurrentWallet(currentWallet);
        dailyExpenseListDTO.setSecondaryCurrencyCurrentWallet(convertedCurrentWallet);
        dailyExpenseListDTO.setTotal(totalDailyExpense);
        dailyExpenseListDTO.setTotalSaving(totalSaving);
        dailyExpenseListDTO.setIsNextAvailable(nextPreviousWeek.getFirst());
        dailyExpenseListDTO.setIsPreviousAvailable(nextPreviousWeek.getSecond());

        return dailyExpenseListDTO;
    }

    @Override
    public Pair<LocalDate, LocalDate> calculateStartEndDate(Budget budget, int number) {
        LocalDate startDate = budget.getStartDate();
        LocalDate endDate = budget.getEndDate();

        LocalDate currentDate = LocalDate.now().plusDays(number * 7L);

        LocalDate startOfWeek = currentDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = currentDate.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        if (startDate.isAfter(endOfWeek) || endDate.isBefore(startOfWeek)) {
            throw new IllegalArgumentException("Selected week is outside the valid budget range.");
        }

        return Pair.of(startOfWeek, endOfWeek);
    }

    @Override
    public Pair<Boolean, Boolean> calculateNextAndPreviousWeek(Budget budget,LocalDate startOfWeek, LocalDate endOfWeek) {
        LocalDate startDate = budget.getStartDate();
        LocalDate endDate = budget.getEndDate();

        Boolean isNextWeekAvailable;
        Boolean isPreviousWeekAvailable;

        LocalDate startOfNextWeek = startOfWeek.plusDays(7);
        LocalDate endOfPreviousWeek = endOfWeek.minusDays(7);

        isNextWeekAvailable = !endDate.isBefore(startOfNextWeek);
        isPreviousWeekAvailable = !startDate.isAfter(endOfPreviousWeek);

        System.out.println(isNextWeekAvailable);
        System.out.println(isPreviousWeekAvailable);

        return Pair.of(isNextWeekAvailable, isPreviousWeekAvailable);
    }

    @Override
    public Double calculateTotalExpense(List<DailyExpense> dailyExpenses){
        BigDecimal total = dailyExpenses.stream()
                .map(expense -> BigDecimal.valueOf(expense.getAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return total.doubleValue();
    }

    public List<DailyExpenseSavingDTO> generateEmptyDailyExpense(
            Budget budget,
            List<DailyExpenseSavingDTO> existingDailyExpenses,
            LocalDate startOfWeek,
            LocalDate endOfWeek) {

        List<DailyExpenseSavingDTO> emptyExpenses = new ArrayList<>();

        LocalDate currentDate = startOfWeek;
        while (!currentDate.isAfter(endOfWeek)) {
            final LocalDate localCurrentDate = currentDate;

            // Vérifie que la date actuelle est strictement comprise entre startDate et endDate
            if (!localCurrentDate.isBefore(budget.getStartDate()) &&
                    !localCurrentDate.isAfter(budget.getEndDate()) &&
                    existingDailyExpenses.stream().noneMatch(expense -> expense.getDate().equals(localCurrentDate))) {

                DailyExpenseSavingDTO expense = new DailyExpenseSavingDTO();
                expense.setDate(localCurrentDate);
                expense.setAmount(0.0);
                expense.setSaving(0.0);
                emptyExpenses.add(expense);
            }
            currentDate = currentDate.plusDays(1);
        }
        return emptyExpenses;
    }
}