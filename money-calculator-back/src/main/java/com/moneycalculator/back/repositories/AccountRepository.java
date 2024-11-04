package com.moneycalculator.back.repositories;

import com.moneycalculator.back.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer>{

    Optional<Account> findByLabel(String label);
}
