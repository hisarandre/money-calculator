package com.moneycalculator.back.controllers;

import com.moneycalculator.back.dto.AccountLabelFeeDTO;
import com.moneycalculator.back.dto.BudgetDTO;
import com.moneycalculator.back.dto.BudgetLabelAmountDateDTO;
import com.moneycalculator.back.dto.TransactionDTO;
import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.models.Budget;
import com.moneycalculator.back.models.Currency;
import com.moneycalculator.back.models.FixedExpense;
import com.moneycalculator.back.services.AccountServiceImpl;
import com.moneycalculator.back.services.BudgetServiceImpl;
import com.moneycalculator.back.services.CurrencyConversionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    private static final Logger logger = LoggerFactory.getLogger(BudgetController.class);
    private final BudgetServiceImpl budgetService;
    private final CurrencyConversionService currencyConversionService;

    @Autowired
    public BudgetController(BudgetServiceImpl budgetService, CurrencyConversionService currencyConversionService) {
        this.budgetService = budgetService;
        this.currencyConversionService = currencyConversionService;
    }

    @Operation(summary = "Retrieve the current budget", description = "Fetches the current budget details.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Budget retrieved successfully",
                    content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = BudgetDTO.class))
                    }
            ),
            @ApiResponse(responseCode = "204", description = "No budget found", content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden", content = @Content)
    })
    @GetMapping()
    public ResponseEntity<BudgetDTO> getBudget() {
        logger.info("Get budget ");
        BudgetDTO budget = budgetService.getBudget();
        return ResponseEntity.ok(budget);
    }

    @Operation(summary = "Get currencies", description = "Fetches the list of all available currencies")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Currencies retrieved successfully", content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden", content = @Content)
    })
    @GetMapping("/currencies")
    public ResponseEntity<List<Currency>> getCurrencies() {
        logger.info("Get currencies ");
        List<Currency> currencies = currencyConversionService.getCurrencies();
        return ResponseEntity.ok(currencies);
    }

    @Operation(summary = "Reset the budget", description = "Resets the budget to its initial state.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Budget reset successfully", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid budget input", content = @Content)
    })
    @PutMapping("/reset")
    public ResponseEntity<Void> resetBudget(@Valid @RequestBody Budget budget) {
        logger.info("Reset budget");
        budgetService.resetBudget(budget);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update the budget", description = "Updates the budget with new label, amount, and date.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Budget updated successfully", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content(schema = @Schema(example = "Invalid budget data"))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @PutMapping("/edit")
    public ResponseEntity<?> updateBudget(@Valid @RequestBody BudgetLabelAmountDateDTO budget) {
        try {
            logger.info("Update budget");
            budgetService.updateBudget(budget);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
