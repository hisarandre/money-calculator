package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.BudgetDTO;
import com.moneycalculator.back.dto.BudgetLabelAmountDateDTO;
import com.moneycalculator.back.dto.UserDTO;
import com.moneycalculator.back.models.Budget;
import com.moneycalculator.back.models.MapstructMapper;
import com.moneycalculator.back.models.User;
import com.moneycalculator.back.repositories.BudgetRepository;
import com.moneycalculator.back.repositories.DailyExpenseRepository;
import com.moneycalculator.back.repositories.FixedExpenseRepository;
import com.moneycalculator.back.repositories.UserRepository;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.rmi.server.UID;
import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;


@Service
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getUserById(String userId) {
        return userRepository.findOneById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
    }

    @Override
    public void editUser(String userId, UserDTO userDTO) {
        User user = userRepository.findOneById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));

        user.setDisplayName(userDTO.getDisplayName());
        user.setPhotoURL(userDTO.getPhotoURL());

        userRepository.save(user);
    }
}
