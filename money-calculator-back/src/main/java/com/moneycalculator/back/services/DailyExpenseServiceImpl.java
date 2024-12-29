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
import jakarta.persistence.criteria.CriteriaBuilder;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Period;
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
        Budget budget = budgetService.getCurrentBudget();
        List<FixedExpense> fixedExpenses = fixedExpenseRepository.findAll();
        Double totalFixedExpense = fixedExpenseService.calculateTotalExpense(budget, fixedExpenses);
        Double estimatedBudget = BigDecimalUtils.roundToTwoDecimalPlaces(budgetService.calculateEstimatedBudgetPerDay(totalFixedExpense));

        List<DailyExpense> dailyExpenses = dailyExpenseRepository.findAll();
        List<DailyExpenseCalendarDTO> dailyExpenseToCalendarDTOs = mapper.dailyExpenseToCalendarDTOs(dailyExpenses);

        for(DailyExpenseCalendarDTO dailyExpenseSavingDTO : dailyExpenseToCalendarDTOs){

            DailyExpense dailyExpense = dailyExpenses.stream()
                    .filter(d -> d.getId().equals(dailyExpenseSavingDTO.getId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("DailyExpense not found with ID: " + dailyExpenseSavingDTO.getId()));

            dailyExpenseSavingDTO.setSaving(estimatedBudget - dailyExpense.getAmount());
        }

        return dailyExpenseToCalendarDTOs;
    }

    @Override
    public Integer calculateCurrentWeekNumber(LocalDate date){
        LocalDate currentDate = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate startOfDate = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        return (int) ChronoUnit.WEEKS.between(currentDate, startOfDate);
    }

    @Override
    public DailyExpenseListDTO getDailyExpensePerWeek(Integer number) {
        Budget budget =  budgetService.getCurrentBudget();

        Pair<LocalDate, LocalDate> dateRange = calculateStartEndDate(budget, number);
        Pair<Boolean, Boolean> nextPreviousWeek = calculateNextAndPreviousWeek(budget, dateRange.getFirst(), dateRange.getSecond());

        List<FixedExpense> fixedExpenses = fixedExpenseRepository.findAll();
        List<DailyExpense> dailyExpenses = dailyExpenseRepository.findAll();
        List<DailyExpense> weekDailyExpenses = dailyExpenseRepository.findDailyExpensesByDateBetween(dateRange.getFirst(), dateRange.getSecond());
        List<DailyExpenseSavingDTO> dailyExpensesDto = mapper.dailyExpenseToDTOs(weekDailyExpenses);

        Double totalPerWeekDailyExpense = calculateTotalExpense(weekDailyExpenses);
        Double totalDailyExpense = calculateTotalExpense(dailyExpenses);
        Double totalFixedExpense = fixedExpenseService.calculateTotalExpense(budget, fixedExpenses);
        Double estimatedBudget = BigDecimalUtils.roundToTwoDecimalPlaces(budgetService.calculateEstimatedBudgetPerDay(totalFixedExpense));

        List<DailyExpenseSavingDTO> emptyDailyExpenses = generateEmptyDailyExpense(budget, dailyExpensesDto, dateRange.getFirst(), dateRange.getSecond(), estimatedBudget);
        dailyExpensesDto.addAll(emptyDailyExpenses);
        dailyExpensesDto.sort(Comparator.comparing(DailyExpenseSavingDTO::getDate));

        Double totalSaving = calculateTotalSaving(dailyExpensesDto, estimatedBudget);
        totalSaving = BigDecimalUtils.roundToTwoDecimalPlaces(totalSaving);

        Double currentWallet = totalDailyExpense + totalFixedExpense;
        Double convertedCurrentWallet = budgetService.calculateConvertedAmountFromBudget(budget, currentWallet);

        return createDailyExpenseListDTO(dailyExpensesDto, currentWallet, convertedCurrentWallet, totalPerWeekDailyExpense, totalSaving, nextPreviousWeek);
    }

    private Double calculateTotalSaving(List<DailyExpenseSavingDTO> dailyExpensesDto, Double estimatedBudget) {
        Double totalSaving = 0.0;
        for (DailyExpenseSavingDTO expenseDto : dailyExpensesDto) {
            Double saving = BigDecimalUtils.roundToTwoDecimalPlaces(estimatedBudget - expenseDto.getAmount());
            totalSaving += saving;
            expenseDto.setSaving(saving);
        }
        return totalSaving;
    }

    private DailyExpenseListDTO createDailyExpenseListDTO(List<DailyExpenseSavingDTO> dailyExpensesDto, Double currentWallet, Double convertedCurrentWallet, Double totalDailyExpense, Double totalSaving, Pair<Boolean, Boolean> nextPreviousWeek) {
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
    public DailyExpenseListDTO setDailyExpense(DailyExpenseAmountDateDTO dailyExpenseAmountDateDTO) {
        Double roundedAmount = BigDecimalUtils.roundToTwoDecimalPlaces(dailyExpenseAmountDateDTO.getAmount());
        DailyExpense dailyExpense = dailyExpenseRepository.findOneByDate(dailyExpenseAmountDateDTO.getDate())
                .orElseGet(DailyExpense::new);

        dailyExpense.setDate(dailyExpenseAmountDateDTO.getDate());
        dailyExpense.setAmount(roundedAmount);
        dailyExpenseRepository.save(dailyExpense);

        Integer weekNumber = calculateCurrentWeekNumber(dailyExpenseAmountDateDTO.getDate());

        return getDailyExpensePerWeek(weekNumber);
    }

    @Override
    public Pair<LocalDate, LocalDate> calculateStartEndDate(Budget budget, int number) {
        LocalDate currentDate = LocalDate.now().plusDays(number * 7L);
        LocalDate startOfWeek = currentDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = currentDate.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        LocalDate startDate = budget.getStartDate();
        LocalDate endDate = budget.getEndDate();

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
            LocalDate endOfWeek,
            Double estimatedBudget
    ) {

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
                expense.setSaving(estimatedBudget);
                emptyExpenses.add(expense);
            }
            currentDate = currentDate.plusDays(1);
        }
        return emptyExpenses;
    }

    @Override
    public List<DailyExpenseWeekSavingDTO> getDailyExpensePerSaving(){

        List<DailyExpenseWeekSavingDTO> dailyExpenseWeekSavingDTOS = new ArrayList<>();

        Budget budget = budgetService.getCurrentBudget();

        LocalDate startDate = budget.getStartDate();
        LocalDate today = LocalDate.now();

        long weeksAvailable = ChronoUnit.WEEKS.between(startDate, today);

        for(int i = 0; i < weeksAvailable ; i++){
            DailyExpenseListDTO dailyExpenseListDTO = getDailyExpensePerWeek(-i);
            DailyExpenseWeekSavingDTO dailyExpenseWeekSavingDTO = new DailyExpenseWeekSavingDTO();
            dailyExpenseWeekSavingDTO.setTotalExpense(dailyExpenseListDTO.getTotal());
            dailyExpenseWeekSavingDTO.setTotalSaving(dailyExpenseListDTO.getTotalSaving());

            List<DailyExpenseSavingDTO> dailyExpenses = dailyExpenseListDTO.getDailyExpenses();
            DailyExpenseSavingDTO firstDailyExpense = dailyExpenses.stream().toList().getFirst();
            DailyExpenseSavingDTO lastDailyExpense = dailyExpenses.stream().toList().getLast();

            dailyExpenseWeekSavingDTO.setStartDate(firstDailyExpense.getDate());
            dailyExpenseWeekSavingDTO.setEndDate(lastDailyExpense.getDate());

            dailyExpenseWeekSavingDTOS.add(dailyExpenseWeekSavingDTO);
        }

        return dailyExpenseWeekSavingDTOS;
    }

}