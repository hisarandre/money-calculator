package com.moneycalculator.back.repositories;

import com.moneycalculator.back.models.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface BudgetRepository extends JpaRepository<Budget, Integer> {
}
