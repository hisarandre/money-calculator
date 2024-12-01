package com.moneycalculator.back.repositories;

import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.models.AccountBalanceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AccountBalanceHistoryRepository extends JpaRepository<AccountBalanceHistory, Integer> {

    @Query("SELECT h FROM AccountBalanceHistory h WHERE h.date >= :startDate")
    List<AccountBalanceHistory> findAllFromLast12Months(@Param("startDate") LocalDate startDate);

    AccountBalanceHistory findTopByOrderByDateDesc();

    int countByDate(LocalDate date);

    AccountBalanceHistory findByDate(LocalDate date);

    AccountBalanceHistory findFirstByOrderByDateDesc();
}
