package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.*;
import com.moneycalculator.back.models.*;
import com.moneycalculator.back.repositories.AccountRepository;
import com.moneycalculator.back.repositories.BudgetRepository;
import com.moneycalculator.back.repositories.DailyExpenseRepository;
import com.moneycalculator.back.repositories.FixedExpenseRepository;
import com.moneycalculator.back.utils.BigDecimalUtils;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FixedExpenseServiceImpl implements FixedExpenseService {

    private final FixedExpenseRepository fixedExpenseRepository;
    private final BudgetRepository budgetRepository;
    private final DailyExpenseRepository dailyExpenseRepository;
    private final BudgetServiceImpl budgetService;
    private final CurrencyConversionService currencyConversionService;
    private final MapstructMapper mapper = Mappers.getMapper(MapstructMapper.class);

    @Autowired
    public FixedExpenseServiceImpl(FixedExpenseRepository fixedExpenseRepository,
                                   BudgetRepository budgetRepository,
                                   DailyExpenseRepository dailyExpenseRepository,
                                   BudgetServiceImpl budgetService,
                                   CurrencyConversionService currencyConversionService) {
        this.fixedExpenseRepository = fixedExpenseRepository;
        this.currencyConversionService = currencyConversionService;
        this.budgetRepository = budgetRepository;
        this.budgetService = budgetService;
        this.dailyExpenseRepository = dailyExpenseRepository;
    }

    @Override
    public FixedExpenseListEstimatedBudgetDTO getAllFixedExpenses() {

        Budget budget = budgetRepository.findById(1)
                .orElseThrow(() -> new IllegalArgumentException("No budget found."));

        List<FixedExpense> expenses = fixedExpenseRepository.findAll();

        if (expenses.isEmpty()) {
            Double emptyEstimatedBudget = budgetService.calculateEstimatedBudgetPerDay(budget, 0.0);
            emptyEstimatedBudget = BigDecimalUtils.roundToTwoDecimalPlaces(emptyEstimatedBudget);

            // Calculate current wallet
            Double emptyMainCurrencyCurrentWallet = calculateCurrentWallet(0.0);

            FixedExpenseListEstimatedBudgetDTO emptyData = new FixedExpenseListEstimatedBudgetDTO();
            emptyData.setFixedExpenses(new ArrayList<>());
            emptyData.setEstimatedBudget(emptyEstimatedBudget);
            emptyData.setMainCurrencyCurrentWallet(emptyMainCurrencyCurrentWallet);
            emptyData.setSecondaryCurrencyCurrentWallet(null);
            emptyData.setMainCurrencyTotalExpenses(0.0);
            emptyData.setSecondaryCurrencyTotalExpenses(null);
            return emptyData;
        }

        List<FixedExpenseDTO> expenseDTOS = mapper.listFixedExpenseToDTOs(expenses);

        // Process each expense and calculate the secondary currency amount
        expenseDTOS.forEach(expense -> {
            Double convertedAmount = budgetService.calculateConvertedAmountFromBudget(budget, expense.getMainCurrencyAmount());
            expense.setSecondaryCurrencyAmount(convertedAmount);
        });

        // Calculate totals
        Double mainCurrencyTotal = calculateTotalExpense(budget, expenses);
        Double secondaryCurrencyTotal = budgetService.calculateConvertedAmountFromBudget(budget, mainCurrencyTotal);

        // Calculate the estimated budget per day
        Double estimatedBudgetPerDay = budgetService.calculateEstimatedBudgetPerDay(budget, mainCurrencyTotal);
        estimatedBudgetPerDay = BigDecimalUtils.roundToTwoDecimalPlaces(estimatedBudgetPerDay);

        // Calculate current wallet
        Double mainCurrencyCurrentWallet = calculateCurrentWallet(mainCurrencyTotal);
        Double secondaryCurrencyCurrentWallet = budgetService.calculateConvertedAmountFromBudget(budget, mainCurrencyCurrentWallet);

        FixedExpenseListEstimatedBudgetDTO fixedExpenseListEstimatedBudgetDTO = new FixedExpenseListEstimatedBudgetDTO();
        fixedExpenseListEstimatedBudgetDTO.setFixedExpenses(expenseDTOS);
        fixedExpenseListEstimatedBudgetDTO.setEstimatedBudget(estimatedBudgetPerDay);
        fixedExpenseListEstimatedBudgetDTO.setMainCurrencyTotalExpenses(mainCurrencyTotal);
        fixedExpenseListEstimatedBudgetDTO.setSecondaryCurrencyTotalExpenses(secondaryCurrencyTotal);
        fixedExpenseListEstimatedBudgetDTO.setMainCurrencyCurrentWallet(mainCurrencyCurrentWallet);
        fixedExpenseListEstimatedBudgetDTO.setSecondaryCurrencyCurrentWallet(secondaryCurrencyCurrentWallet);

        return fixedExpenseListEstimatedBudgetDTO;
    }

    @Override
    public FixedExpenseTotalDTO addFixedExpense(FixedExpenseLabelAmountFrequencyDTO fixedExpenseLabelAmountFrequencyDTO) {
        // Check duplicates
        Optional<FixedExpense> existingExpense = fixedExpenseRepository.findByLabel(fixedExpenseLabelAmountFrequencyDTO.getLabel());

        if (existingExpense.isPresent()) {
            throw new IllegalArgumentException("A fixed expense with this label already exists.");
        }

        FixedExpense fixedExpense = mapper.fixedExpenseDTOToFixedExpense(fixedExpenseLabelAmountFrequencyDTO);
        Double roundedAmount = BigDecimalUtils.roundToTwoDecimalPlaces(fixedExpense.getAmount());
        fixedExpense.setAmount(roundedAmount);

        fixedExpense = fixedExpenseRepository.save(fixedExpense);

        return convertExpenseToExpenseWithTotal(fixedExpense);
    }

    @Override
    public FixedExpenseTotalDTO updateFixedExpense(Integer id, FixedExpenseLabelAmountFrequencyDTO fixedExpenseDTO) {
        FixedExpense existingFixedExpense = fixedExpenseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fixed expense not found with ID: " + id));

        Double roundedAmount = BigDecimalUtils.roundToTwoDecimalPlaces(fixedExpenseDTO.getAmount());

        existingFixedExpense.setLabel(fixedExpenseDTO.getLabel());
        existingFixedExpense.setAmount(roundedAmount);
        existingFixedExpense.setFrequency(fixedExpenseDTO.getFrequency());

        FixedExpense fixedExpenseUpdated = fixedExpenseRepository.save(existingFixedExpense);

        return convertExpenseToExpenseWithTotal(fixedExpenseUpdated);

    }

    @Override
    public FixedExpenseIdEstimatedBudgetDTO deleteFixedExpense(Integer id) {
        if (!fixedExpenseRepository.existsById(id)) {
            throw new EntityNotFoundException("Fixed expense not found");
        }

        // Determine the budget
        Budget budget = budgetRepository.findById(1)
                .orElseThrow(() -> new IllegalArgumentException("No budget found."));

        fixedExpenseRepository.deleteById(id);

        FixedExpenseListEstimatedBudgetDTO fixedExpenseListEstimatedBudgetDTO = getAllFixedExpenses();

        Double mainCurrencyCurrentWallet = calculateCurrentWallet(fixedExpenseListEstimatedBudgetDTO.getMainCurrencyTotalExpenses());
        Double secondaryCurrencyCurrentWallet = budgetService.calculateConvertedAmountFromBudget(budget, mainCurrencyCurrentWallet);

        FixedExpenseIdEstimatedBudgetDTO fixedExpenseIdEstimatedBudgetDTO = new FixedExpenseIdEstimatedBudgetDTO();
        fixedExpenseIdEstimatedBudgetDTO.setId(id);
        fixedExpenseIdEstimatedBudgetDTO.setEstimatedBudget(fixedExpenseListEstimatedBudgetDTO.getEstimatedBudget());
        fixedExpenseIdEstimatedBudgetDTO.setMainCurrencyTotalExpenses(fixedExpenseListEstimatedBudgetDTO.getMainCurrencyTotalExpenses());
        fixedExpenseIdEstimatedBudgetDTO.setSecondaryCurrencyTotalExpenses(fixedExpenseListEstimatedBudgetDTO.getSecondaryCurrencyTotalExpenses());
        fixedExpenseIdEstimatedBudgetDTO.setMainCurrencyCurrentWallet(mainCurrencyCurrentWallet);
        fixedExpenseIdEstimatedBudgetDTO.setSecondaryCurrencyCurrentWallet(secondaryCurrencyCurrentWallet);

        return fixedExpenseIdEstimatedBudgetDTO;
    }

    @Override
    public Double calculateTotalExpense(Budget budget, List<FixedExpense> expenses) {

        // Get the duration between start and end dates
        LocalDate startDate = budget.getStartDate();
        LocalDate endDate = budget.getEndDate();
        long monthsBetween = ChronoUnit.MONTHS.between(startDate, endDate);

        BigDecimal total = expenses.stream()
                .map(expense -> {
                    BigDecimal amount = BigDecimal.valueOf(expense.getAmount());

                    int frequency = expense.getFrequency();

                    // Calculate the number of occurrences for this expense
                    long occurrences = monthsBetween / frequency;

                    // Multiply the expense amount by the number of occurrences
                    return amount.multiply(BigDecimal.valueOf(occurrences));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return total.doubleValue();
    }

    @Override
    public FixedExpenseTotalDTO convertExpenseToExpenseWithTotal(FixedExpense fixedExpense){
        Budget budget = budgetRepository.findById(1)
                .orElseThrow(() -> new IllegalArgumentException("No budget found."));

        FixedExpenseDTO fixedExpenseDTO = mapper.fixedExpenseToDTO(fixedExpense);

        Double secondaryCurrencyAmount = budgetService.calculateConvertedAmountFromBudget(budget, fixedExpenseDTO.getMainCurrencyAmount());
        fixedExpenseDTO.setSecondaryCurrencyAmount(secondaryCurrencyAmount);

        List<FixedExpense> expenses = fixedExpenseRepository.findAll();

        // Calculate totals
        Double mainCurrencyTotal = calculateTotalExpense(budget, expenses);
        Double secondaryCurrencyTotal = budgetService.calculateConvertedAmountFromBudget(budget, mainCurrencyTotal);

        // Calculate the estimated budget per day
        Double estimatedBudgetPerDay = budgetService.calculateEstimatedBudgetPerDay(budget, mainCurrencyTotal);
        estimatedBudgetPerDay = BigDecimalUtils.roundToTwoDecimalPlaces(estimatedBudgetPerDay);

        Double mainCurrencyCurrentWallet = calculateCurrentWallet(mainCurrencyTotal);
        Double secondaryCurrencyCurrentWallet = budgetService.calculateConvertedAmountFromBudget(budget, mainCurrencyCurrentWallet);

        FixedExpenseTotalDTO fixedExpenseTotalDTO = new FixedExpenseTotalDTO();
        fixedExpenseTotalDTO.setFixedExpense(fixedExpenseDTO);
        fixedExpenseTotalDTO.setEstimatedBudget(estimatedBudgetPerDay);
        fixedExpenseTotalDTO.setMainCurrencyTotalExpenses(mainCurrencyTotal);
        fixedExpenseTotalDTO.setSecondaryCurrencyTotalExpenses(secondaryCurrencyTotal);
        fixedExpenseTotalDTO.setMainCurrencyCurrentWallet(mainCurrencyCurrentWallet);
        fixedExpenseTotalDTO.setSecondaryCurrencyCurrentWallet(secondaryCurrencyCurrentWallet);

        return fixedExpenseTotalDTO;
    }

    @Override
    public Double calculateCurrentWallet(Double totalExpenses){

        List<DailyExpense> dailyExpense = dailyExpenseRepository.findAll();
        Double totalDailyExpenses = calculateTotalDailyExpense(dailyExpense);

        return totalExpenses + totalDailyExpenses;
    }

    public Double calculateTotalDailyExpense(List<DailyExpense> dailyExpenses){
        BigDecimal total = dailyExpenses.stream()
                .map(expense -> BigDecimal.valueOf(expense.getAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return total.doubleValue();
    }

}
