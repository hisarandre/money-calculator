package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.BudgetDTO;
import com.moneycalculator.back.dto.BudgetLabelAmountDateDTO;
import com.moneycalculator.back.dto.UserDTO;
import com.moneycalculator.back.models.Budget;
import com.moneycalculator.back.models.User;

import java.util.UUID;

public interface UserService {

    User getUserById(String userId);

    void editUser(String userId, UserDTO userDTO);
}
