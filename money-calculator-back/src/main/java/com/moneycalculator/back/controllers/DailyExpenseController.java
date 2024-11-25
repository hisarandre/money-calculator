package com.moneycalculator.back.controllers;

import com.moneycalculator.back.dto.*;
import com.moneycalculator.back.models.DailyExpense;
import com.moneycalculator.back.models.FixedExpense;
import com.moneycalculator.back.services.DailyExpenseServiceImpl;
import com.moneycalculator.back.services.FixedExpenseServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/daily-expense")
public class DailyExpenseController {

    private static final Logger logger = LoggerFactory.getLogger(DailyExpenseController.class);
    private final DailyExpenseServiceImpl dailyExpenseService;

    @Autowired
    public DailyExpenseController(DailyExpenseServiceImpl dailyExpenseService) {
        this.dailyExpenseService = dailyExpenseService;
    }

    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Expenses retrieved successfully",
                    content = {
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = FixedExpenseListEstimatedBudgetDTO.class)  // Updated to return DTO
                            )
                    }
            ),
            @ApiResponse(
                    responseCode = "204",
                    description = "No expense found",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content
            )
    })
    @GetMapping("/all")
    public ResponseEntity<List<DailyExpense>> getAllDailyExpense() {
        logger.info("Get all daily expense expenses");

        List<DailyExpense> dailyExpenses = dailyExpenseService.getAllDailyExpense();

        return ResponseEntity.ok(dailyExpenses);
    }

    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Expenses retrieved successfully",
                    content = {
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = FixedExpenseListEstimatedBudgetDTO.class)  // Updated to return DTO
                            )
                    }
            ),
            @ApiResponse(
                    responseCode = "204",
                    description = "No expense found",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content
            )
    })
    @GetMapping("/week/{number}")
    public ResponseEntity<DailyExpenseListDTO> getDailyExpensePerWeek(@PathVariable Integer number) {
        logger.info("Get all daily expense expenses for current week + " + number);

        DailyExpenseListDTO dailyExpenseList = dailyExpenseService.getDailyExpensePerWeek(number);

        return ResponseEntity.ok(dailyExpenseList);
    }


/*    @Operation(
            summary = "Update a fixed expense",
            description = "Updates the fixed expense with the provided ID."
    )
    @ApiResponses(value = {

            @ApiResponse(
                    responseCode = "200",
                    description = "Fixed expense updated successfully",
                    content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = FixedExpense.class))
                    }
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = String.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Account not found with specified ID",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = String.class))
            )
    })
    @PostMapping("/week/set-expense")
    public ResponseEntity<?> updateFixedExpense(@Valid @RequestBody FixedExpenseLabelAmountFrequencyDTO fixedExpenseLabelAmountFrequencyDTO) {
        logger.info("Updating expense with ID: " + fixedExpenseLabelAmountFrequencyDTO);

        try {
            FixedExpenseTotalDTO fixedExpenseDTO = fixedExpenseService.updateFixedExpense(id, fixedExpenseLabelAmountFrequencyDTO);
            return ResponseEntity.ok(fixedExpenseDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Fixed expense not found");
        }
    }*/

}
