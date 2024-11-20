package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.BudgetDTO;
import com.moneycalculator.back.models.Budget;

public interface BudgetService {

    BudgetDTO getBudgetById(Integer id);
}
