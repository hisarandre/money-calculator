package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.*;
import com.moneycalculator.back.models.*;
import com.moneycalculator.back.repositories.AccountRepository;
import com.moneycalculator.back.repositories.BudgetRepository;
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
import java.util.List;
import java.util.Optional;

@Service
public class FixedExpenseServiceImpl implements FixedExpenseService {

    private final FixedExpenseRepository fixedExpenseRepository;
    private final BudgetRepository budgetRepository;
    private final CurrencyConversionService currencyConversionService;
    private final MapstructMapper mapper = Mappers.getMapper(MapstructMapper.class);

    @Autowired
    public FixedExpenseServiceImpl(FixedExpenseRepository fixedExpenseRepository,
                                   BudgetRepository budgetRepository,
                                   CurrencyConversionService currencyConversionService) {
        this.fixedExpenseRepository = fixedExpenseRepository;
        this.currencyConversionService = currencyConversionService;
        this.budgetRepository = budgetRepository;
    }

    @Override
    public FixedExpenseListEstimatedBudgetDTO getAllFixedExpenses() {

        // Fetch all fixed expenses
        List<FixedExpense> expenses = fixedExpenseRepository.findAll();
        List<FixedExpenseDTO> expenseDTOS = mapper.listFixedExpenseToDTOs(expenses);

        // Determine the budget (assume at least one expense has a non-null budget)
        Budget budget = expenses.stream()
                .map(FixedExpense::getBudget)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No valid budgets found."));

        // Process each expense and calculate the secondary currency amount
        expenseDTOS.forEach(expense -> {
            if (budget.getConversion()) {
                Double convertedAmount = currencyConversionService.getConvertedAmount(
                        budget.getMainCurrency(),
                        budget.getSecondaryCurrency(),
                        expense.getMainCurrencyAmount()
                );
                expense.setSecondaryCurrencyAmount(convertedAmount);
            } else {
                expense.setSecondaryCurrencyAmount(null);
            }
        });

        // Calculate totals
        Double mainCurrencyTotal = calculateTotalExpense(budget, expenses);

        Double secondaryCurrencyTotal = null;
        if (budget.getConversion()) {
            secondaryCurrencyTotal = currencyConversionService.getConvertedAmount(
                    budget.getMainCurrency(),
                    budget.getSecondaryCurrency(),
                    mainCurrencyTotal
            );
        }

        // Calculate the estimated budget per day
        Double estimatedBudgetPerDay = calculateEstimatedBudgetPerDay(budget, mainCurrencyTotal);
        estimatedBudgetPerDay = BigDecimalUtils.roundToTwoDecimalPlaces(estimatedBudgetPerDay);

        FixedExpenseListEstimatedBudgetDTO fixedExpenseListEstimatedBudgetDTO = new FixedExpenseListEstimatedBudgetDTO();
        fixedExpenseListEstimatedBudgetDTO.setFixedExpenses(expenseDTOS);
        fixedExpenseListEstimatedBudgetDTO.setEstimatedBudget(estimatedBudgetPerDay);
        fixedExpenseListEstimatedBudgetDTO.setMainCurrencyTotalExpenses(mainCurrencyTotal);
        fixedExpenseListEstimatedBudgetDTO.setSecondaryCurrencyTotalExpenses(secondaryCurrencyTotal);

        return fixedExpenseListEstimatedBudgetDTO;
    }

    @Override
    public FixedExpenseTotalDTO addFixedExpense(FixedExpenseLabelAmountFrequencyDTO fixedExpenseLabelAmountFrequencyDTO) {
        // Check for duplicates
        Optional<FixedExpense> existingExpense = fixedExpenseRepository.findByLabel(fixedExpenseLabelAmountFrequencyDTO.getLabel());

        if (existingExpense.isPresent()) {
            throw new IllegalArgumentException("A fixed expense with this label already exists.");
        }

        // Determine the budget
        Budget budget = budgetRepository.findById(1)
                .orElseThrow(() -> new IllegalArgumentException("No budget found."));

        FixedExpense fixedExpense = mapper.fixedExpenseDTOToFixedExpense(fixedExpenseLabelAmountFrequencyDTO);
        fixedExpense.setBudget(budget);

        fixedExpense = fixedExpenseRepository.save(fixedExpense);

        FixedExpenseDTO fixedExpenseDTO = mapper.fixedExpenseToDTO(fixedExpense);

        if (budget.getConversion()) {
            Double convertedAmount = currencyConversionService.getConvertedAmount(
                    budget.getMainCurrency(),
                    budget.getSecondaryCurrency(),
                    fixedExpenseDTO.getMainCurrencyAmount()
            );
            fixedExpenseDTO.setSecondaryCurrencyAmount(convertedAmount);
        } else {
            fixedExpenseDTO.setSecondaryCurrencyAmount(null);
        }

        List<FixedExpense> expenses = fixedExpenseRepository.findAll();

        // Calculate totals
        Double mainCurrencyTotal = calculateTotalExpense(budget, expenses);

        Double secondaryCurrencyTotal = null;
        if (budget.getConversion()) {
            secondaryCurrencyTotal = currencyConversionService.getConvertedAmount(
                    budget.getMainCurrency(),
                    budget.getSecondaryCurrency(),
                    mainCurrencyTotal
            );
        }

        // Calculate the estimated budget per day
        Double estimatedBudgetPerDay = calculateEstimatedBudgetPerDay(budget, mainCurrencyTotal);
        estimatedBudgetPerDay = BigDecimalUtils.roundToTwoDecimalPlaces(estimatedBudgetPerDay);

        FixedExpenseTotalDTO fixedExpenseTotalDTO = new FixedExpenseTotalDTO();
        fixedExpenseTotalDTO.setFixedExpense(fixedExpenseDTO);
        fixedExpenseTotalDTO.setEstimatedBudget(estimatedBudgetPerDay);
        fixedExpenseTotalDTO.setMainCurrencyTotalExpenses(mainCurrencyTotal);
        fixedExpenseTotalDTO.setSecondaryCurrencyTotalExpenses(secondaryCurrencyTotal);

        return fixedExpenseTotalDTO;
    }
/*
    @Override
    public Account updateAccount(Integer id, Account account) {
        Account existingAccount = fixedExpenseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with ID: " + id));

        Double roundedFee = BigDecimalUtils.roundToTwoDecimalPlaces(account.getFee());

        existingAccount.setLabel(account.getLabel());
        existingAccount.setFee(roundedFee);

        return fixedExpenseRepository.save(existingAccount);
    }

    @Override
    public void deleteAccount(Integer id) {
        if (!fixedExpenseRepository.existsById(id)) {
            throw new EntityNotFoundException("Account not found");
        }
        fixedExpenseRepository.deleteById(id);
    }*/

    @Override
    public Double calculateEstimatedBudgetPerDay(Budget budget, Double totalExpenses){
        // Calculate remaining amount
        Double totalRemaining = budget.getAmount() - totalExpenses;

        // Get the start and end dates
        LocalDate startDate = budget.getStartDate();
        LocalDate endDate = budget.getEndDate();

        // Calculate the number of days between the start and end date (inclusive)
        long daysBetween = Duration.between(startDate.atStartOfDay(), endDate.atStartOfDay()).toDays() + 1; // +1 to include the end date

        // Calculate the estimated budget per day
        return totalRemaining / daysBetween;
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
}
