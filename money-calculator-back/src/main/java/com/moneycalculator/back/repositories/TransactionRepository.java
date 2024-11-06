package com.moneycalculator.back.repositories;

import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    Optional<List<Transaction>> findByType(String type);

    Optional<Transaction> findByLabelAndAccount_Id(String label, Integer accountId);

}
