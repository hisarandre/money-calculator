package com.moneycalculator.back.controllers;

import com.moneycalculator.back.dto.*;
import com.moneycalculator.back.models.Account;
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
                                    schema = @Schema(implementation = DailyExpense.class)
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
                                    schema = @Schema(implementation = DailyExpenseListDTO.class)
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
    public ResponseEntity<?> getDailyExpensePerWeek(@PathVariable Integer number) {
        logger.info("Get all daily expense expenses for current week + " + number);
        try {
            DailyExpenseListDTO dailyExpenseList = dailyExpenseService.getDailyExpensePerWeek(number);
            return ResponseEntity.ok(dailyExpenseList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Get daily expense calendar", description = "Retrieves a calendar view of daily expenses.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Calendar data retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = DailyExpenseCalendarDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content)
    })
    @GetMapping("/calendar")
    public ResponseEntity<?> getDailyExpenseCalendar() {
        logger.info("Get all daily expense expenses");
        try {
            List<DailyExpenseCalendarDTO> dailyExpenseCalendars = dailyExpenseService.getDailyExpenseCalendar();
            return ResponseEntity.ok(dailyExpenseCalendars);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Set daily expense", description = "Sets a daily expense for a specific date.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Expense set successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = DailyExpenseListDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content)
    })
    @PostMapping("/week/set-expense")
    public ResponseEntity<?> setDailyExpense(@Valid @RequestBody DailyExpenseAmountDateDTO dailyExpenseAmountDateDTO) {
        logger.info("Adding expense: " + dailyExpenseAmountDateDTO);

        try {
            DailyExpenseListDTO dailyExpenseList = dailyExpenseService.setDailyExpense(dailyExpenseAmountDateDTO);
            return ResponseEntity.ok(dailyExpenseList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Get savings per week", description = "Gets savings and expenses per week the last three months.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Savings retrieved successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = DailyExpenseListDTO.class))),
    })
    @GetMapping("/week/savings")
    public ResponseEntity<List<DailyExpenseWeekSavingDTO>> getDailyExpenseSavings() {
        logger.info("Get savings per week");

        List<DailyExpenseWeekSavingDTO> dailyExpenses = dailyExpenseService.getDailyExpensePerSaving();

        return ResponseEntity.ok(dailyExpenses);
    }


}
