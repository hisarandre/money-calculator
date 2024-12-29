package com.moneycalculator.back.controllers;

import com.moneycalculator.back.dto.TransactionListTotalDTO;
import com.moneycalculator.back.dto.UserDTO;
import com.moneycalculator.back.models.Transaction;
import com.moneycalculator.back.models.User;
import com.moneycalculator.back.services.TransactionService;
import com.moneycalculator.back.services.UserService;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    @GetMapping("/{userId}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User retrieved successfully", content = @Content),
            @ApiResponse(responseCode = "204", description = "No user found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<User> getUser(@PathVariable String userId) {
        logger.info("Get user: " + userId);
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User updated successfully", content = @Content),
            @ApiResponse(responseCode = "204", description = "No user found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<User> editUser(@PathVariable String userId, @Valid @RequestBody UserDTO userDto) {
        logger.info("Update user: " + userId);
        userService.editUser(userId, userDto);
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }
}
