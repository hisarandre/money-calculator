package com.moneycalculator.back.controllers;

import com.moneycalculator.back.dto.AccountBalanceDTO;
import com.moneycalculator.back.models.AccountBalanceHistory;
import com.moneycalculator.back.services.AccountBalanceHistoryServiceImpl;
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

    @GetMapping("/all")
    public ResponseEntity<List<AccountBalanceHistory>> getAllAccountBalanceHistories() {
        logger.info("Get all account balance histories");

        List<AccountBalanceHistory> accountBalanceHistories = accountBalanceHistoryService.getAll();

        if (accountBalanceHistories.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(accountBalanceHistories);
    }

    @GetMapping("/monthly-done")
    public boolean checkMonthlyDone() {
        return accountBalanceHistoryService.checkMonthlyDone();
    }

    @PostMapping("/add")
    public ResponseEntity<?> createAccountBalanceHistory(@Valid @RequestBody List<AccountBalanceDTO> accountBalancesDTO) {
        logger.info("Add new account balance histories: " + accountBalancesDTO);

        AccountBalanceHistory accountBalanceHistories = accountBalanceHistoryService.addAccountBalanceHistory(accountBalancesDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(accountBalanceHistories);
    }

    @PostMapping("/calculate/{date}")
    public Double calculateProjectedAmount(@PathVariable LocalDate date) {
        logger.info("Calculate projecting money : " + date);
        return accountBalanceHistoryService.calculateProjectedAmount(date);
    }

}
