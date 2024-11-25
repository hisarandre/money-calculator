package com.moneycalculator.back.controllers;

import com.moneycalculator.back.dto.AccountLabelFeeDTO;
import com.moneycalculator.back.dto.BudgetDTO;
import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.models.Budget;
import com.moneycalculator.back.models.FixedExpense;
import com.moneycalculator.back.services.AccountServiceImpl;
import com.moneycalculator.back.services.BudgetServiceImpl;
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

import java.util.List;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    private static final Logger logger = LoggerFactory.getLogger(BudgetController.class);
    private final BudgetServiceImpl budgetService;

    @Autowired
    public BudgetController(BudgetServiceImpl budgetService) {
        this.budgetService = budgetService;
    }

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

    //edit amount

    //reset

}
