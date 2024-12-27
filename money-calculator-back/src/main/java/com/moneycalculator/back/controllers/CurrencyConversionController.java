package com.moneycalculator.back.controllers;

import com.moneycalculator.back.dto.BudgetDTO;
import com.moneycalculator.back.dto.BudgetLabelAmountDateDTO;
import com.moneycalculator.back.models.Budget;
import com.moneycalculator.back.models.Currency;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

@RestController
@RequestMapping("/api/currency-conversion")
public class CurrencyConversionController {

    private static final Logger logger = LoggerFactory.getLogger(CurrencyConversionController.class);
    private final BudgetServiceImpl budgetService;
    private final CurrencyConversionService currencyConversionService;

    @Autowired
    public CurrencyConversionController(BudgetServiceImpl budgetService, CurrencyConversionService currencyConversionService) {
        this.budgetService = budgetService;
        this.currencyConversionService = currencyConversionService;
    }

    @Operation(summary = "Get rate", description = "Refresh current rate conversion")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Rate retrieved successfully", content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden", content = @Content)
    })
    @GetMapping("/refresh-rate")
    public ResponseEntity<BigDecimal> refreshRate() {
        logger.info("Get rate ");
        Budget budget = budgetService.getCurrentBudget();
        BigDecimal rate = currencyConversionService.loadConversionRate(budget.getMainCurrency(),budget.getSecondaryCurrency());
        return ResponseEntity.ok(rate);
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


}
