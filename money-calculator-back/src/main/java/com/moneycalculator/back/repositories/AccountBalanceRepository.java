package com.moneycalculator.back.repositories;

import com.moneycalculator.back.models.AccountBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountBalanceRepository  extends JpaRepository<AccountBalance, Integer> {
}
