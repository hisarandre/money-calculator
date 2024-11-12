package com.moneycalculator.back.controllers;

import com.moneycalculator.back.dto.AccountBalanceDTO;
import com.moneycalculator.back.models.AccountBalanceHistory;
import com.moneycalculator.back.services.AccountBalanceHistoryServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/balance")
public class AccountBalanceHistoryController {

    private static final Logger logger = LoggerFactory.getLogger(AccountBalanceHistoryController.class);
    private final AccountBalanceHistoryServiceImpl accountBalanceHistoryService;

    @Autowired
    public AccountBalanceHistoryController(AccountBalanceHistoryServiceImpl accountBalanceHistoryService) {
        this.accountBalanceHistoryService = accountBalanceHistoryService;
    }

    @Operation(summary = "Retrieve all account balance histories",
            description = "Returns a list of all account balance histories. If no history exists, a 204 No Content response is returned.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of account balance histories"),
            @ApiResponse(responseCode = "204", description = "No account balance histories found")
    })
    @GetMapping("/all")
    public ResponseEntity<List<AccountBalanceHistory>> getAllAccountBalanceHistories() {
        logger.info("Get all account balance histories");

        List<AccountBalanceHistory> accountBalanceHistories = accountBalanceHistoryService.getAll();

        if (accountBalanceHistories.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(accountBalanceHistories);
    }

    @Operation(summary = "Check if monthly process is done",
            description = "Returns a boolean indicating whether the monthly account balance process has been completed.")
    @ApiResponse(responseCode = "200", description = "Monthly process status retrieved successfully")
    @GetMapping("/monthly-done")
    public boolean checkMonthlyDone() {
        return accountBalanceHistoryService.checkMonthlyDone();
    }

    @Operation(summary = "Add new account balance histories",
            description = "Creates a new account balance history record for each account balance in the provided list.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Account balance histories created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping("/add")
    public ResponseEntity<?> createAccountBalanceHistory(@Valid @RequestBody List<AccountBalanceDTO> accountBalancesDTO) {
        logger.info("Add new account balance histories: " + accountBalancesDTO);

        AccountBalanceHistory accountBalanceHistories = accountBalanceHistoryService.addAccountBalanceHistory(accountBalancesDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(accountBalanceHistories);
    }

    @PostMapping("/calculate/{date}")
    @Operation(summary = "Calculate projected amount",
            description = "Calculates the projected account balance up to the specified date based on past data.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projected amount calculated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid date format"),
            @ApiResponse(responseCode = "404", description = "No previous AccountBalanceHistory found")
    })
    public Double calculateProjectedAmount(@PathVariable LocalDate date) {
        logger.info("Calculate projecting money : " + date);
        return accountBalanceHistoryService.calculateProjectedAmount(date);
    }

}
