package com.moneycalculator.back.controllers;

import com.moneycalculator.back.dto.AccountBalanceHistoryDTO;
import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.models.AccountBalanceHistory;
import com.moneycalculator.back.services.AccountBalanceHistoryServiceImpl;
import com.moneycalculator.back.services.AccountServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<List<AccountBalanceHistoryDTO>> getAllAccountBalanceHistories() {
        logger.info("Get all account balance histories");

        List<AccountBalanceHistoryDTO> accountBalanceHistories = accountBalanceHistoryService.getAll();

        if (accountBalanceHistories.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(accountBalanceHistories);
    }

}
