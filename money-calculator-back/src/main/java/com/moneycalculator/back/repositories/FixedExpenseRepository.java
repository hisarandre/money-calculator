package com.moneycalculator.back.repositories;

import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.models.FixedExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FixedExpenseRepository extends JpaRepository<FixedExpense, Integer>{

    Optional<FixedExpense> findByLabel(String label);
}
