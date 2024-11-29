package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.BudgetDTO;
import com.moneycalculator.back.dto.BudgetLabelAmountDateDTO;
import com.moneycalculator.back.dto.TransactionListTotalDTO;
import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.models.Budget;
import com.moneycalculator.back.models.MapstructMapper;
import com.moneycalculator.back.models.Transaction;
import com.moneycalculator.back.repositories.AccountRepository;
import com.moneycalculator.back.repositories.BudgetRepository;
import com.moneycalculator.back.repositories.DailyExpenseRepository;
import com.moneycalculator.back.repositories.FixedExpenseRepository;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Service
public class BudgetServiceImpl implements BudgetService{

    private final BudgetRepository budgetRepository;
    private final FixedExpenseRepository fixedExpenseRepository;
    private final DailyExpenseRepository dailyExpenseRepository;
    private final CurrencyConversionService currencyConversionService;
    private final MapstructMapper mapper = Mappers.getMapper(MapstructMapper.class);

    @Autowired
    public BudgetServiceImpl(BudgetRepository budgetRepository,
                             FixedExpenseRepository fixedExpenseRepository,
                             DailyExpenseRepository dailyExpenseRepository,
                             CurrencyConversionService currencyConversionService) {
        this.budgetRepository = budgetRepository;
        this.fixedExpenseRepository = fixedExpenseRepository;
        this.dailyExpenseRepository = dailyExpenseRepository;
        this.currencyConversionService = currencyConversionService;
    }

    @Override
    public BudgetDTO getBudget() {
        Budget budget = budgetRepository.findById(1)
                .orElseThrow(() -> new IllegalArgumentException("No budget found."));

        BudgetDTO budgetDTO = mapper.budgetToBudgetDto(budget);

        if (budget.getConversion()) {
            BigDecimal conversionRate = currencyConversionService.getConversionRate(
                    budget.getMainCurrency(),
                    budget.getSecondaryCurrency()
            );

            budgetDTO.setCurrencyRate(conversionRate);

            Double convertedAmount = currencyConversionService.getConvertedAmount(
                    budget.getMainCurrency(),
                    budget.getSecondaryCurrency(),
                    budget.getAmount()
            );

            budgetDTO.setSecondaryCurrencyAmount(convertedAmount);
        } else {
            budgetDTO.setSecondaryCurrencyAmount(null);
            budgetDTO.setCurrencyRate(null);
        }

        return budgetDTO;
    }

    @Override
    public void resetBudget(Budget newBudget) {
        Budget budget = budgetRepository.findById(1)
                .orElseThrow(() -> new IllegalArgumentException("No budget found."));

        newBudget.setId(1);
        budgetRepository.save(newBudget);

        dailyExpenseRepository.deleteAll();
        fixedExpenseRepository.deleteAll();
    }

    @Override
    public void updateBudget(BudgetLabelAmountDateDTO newBudget) {
        Budget budget = budgetRepository.findById(1)
                .orElseThrow(() -> new IllegalArgumentException("No budget found."));

        if (newBudget.getEndDate().isBefore(budget.getEndDate())){
            throw new IllegalArgumentException("The end date must be before the original end date.");
        }

        budget.setLabel(newBudget.getLabel());
        budget.setEndDate(newBudget.getEndDate());
        budget.setAmount(newBudget.getAmount());
        budgetRepository.save(budget);

        dailyExpenseRepository.deleteAll();
        fixedExpenseRepository.deleteAll();
    }

    @Override
    public Double calculateEstimatedBudgetPerDay(Budget budget, Double totalFixedExpense){

        System.out.println(totalFixedExpense + "totalFixedExpense");
        // Calculate remaining amount
        Double totalRemaining = budget.getAmount() - totalFixedExpense;

        // Get the start and end dates
        LocalDate startDate = budget.getStartDate();
        LocalDate endDate = budget.getEndDate();

        // Calculate the number of days between the start and end date (inclusive)
        long daysBetween = Duration.between(startDate.atStartOfDay(), endDate.atStartOfDay()).toDays() + 1; // +1 to include the end date

        // Calculate the estimated budget per day
        return totalRemaining / daysBetween;
    };

    @Override
    public Double calculateConvertedAmountFromBudget(Budget budget, Double amount){
        if (budget.getConversion()) {
            return currencyConversionService.getConvertedAmount(
                    budget.getMainCurrency(),
                    budget.getSecondaryCurrency(),
                    amount
            );
        } else {
            return null;
        }
    }

}
