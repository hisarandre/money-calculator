package com.moneycalculator.back.repositories;

import com.moneycalculator.back.models.Budget;
import com.moneycalculator.back.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.rmi.server.UID;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findOneById(String userId);
}
