package com.moneycalculator.back.repositories;

import com.moneycalculator.back.models.DailyExpense;
import com.moneycalculator.back.models.FixedExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyExpenseRepository extends JpaRepository<DailyExpense, Integer>{

    List<DailyExpense> findDailyExpensesByDateBetween(LocalDate startDate, LocalDate endDate);

    Optional<DailyExpense> findOneByDate(LocalDate date);
}
