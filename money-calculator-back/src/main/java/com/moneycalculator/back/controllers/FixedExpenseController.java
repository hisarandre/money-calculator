package com.moneycalculator.back.controllers;

import com.moneycalculator.back.dto.*;
import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.models.FixedExpense;
import com.moneycalculator.back.services.AccountServiceImpl;
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
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fixed-expense")
public class FixedExpenseController {

    private static final Logger logger = LoggerFactory.getLogger(FixedExpenseController.class);
    private final FixedExpenseServiceImpl fixedExpenseService;

    @Autowired
    public FixedExpenseController(FixedExpenseServiceImpl fixedExpenseService) {
        this.fixedExpenseService = fixedExpenseService;
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
    public ResponseEntity<FixedExpenseListEstimatedBudgetDTO> getAllFixedExpenses() {
        logger.info("Get all fixed expenses");

        FixedExpenseListEstimatedBudgetDTO fixedExpenseList = fixedExpenseService.getAllFixedExpenses();

        return ResponseEntity.ok(fixedExpenseList);
    }


  @Operation(
            summary = "Add a new fixed expense",
            description = "Creates a new fixed expenses with the provided details."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Fixed expense created successfully",
                    content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = FixedExpenseTotalDTO.class))
                    }
            ),
            @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden", content = @Content),
            @ApiResponse(responseCode = "409", description = "Conflict - Fixed expense already exists", content = @Content)
    })
    @PostMapping("/add")
    public ResponseEntity<?> createFixedExpense(@Valid @RequestBody FixedExpenseLabelAmountFrequencyDTO fixedExpenseLabelAmountFrequencyDTO) {
        logger.info("Adding new fixedExpense: " + fixedExpenseLabelAmountFrequencyDTO);

        try {
            FixedExpenseTotalDTO fixedExpenseDTO = fixedExpenseService.addFixedExpense(fixedExpenseLabelAmountFrequencyDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(fixedExpenseDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(
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
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFixedExpense(@PathVariable Integer id, @Valid @RequestBody FixedExpenseLabelAmountFrequencyDTO fixedExpenseLabelAmountFrequencyDTO) {
        logger.info("Updating expense with ID: " + id);

        try {
            FixedExpenseTotalDTO fixedExpenseDTO = fixedExpenseService.updateFixedExpense(id, fixedExpenseLabelAmountFrequencyDTO);
            return ResponseEntity.ok(fixedExpenseDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Fixed expense not found");
        }
    }


    @Operation(summary = "Delete a fixed expense", description = "Deletes the fixed expense with the given ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fixed expense deleted successfully", content = @Content),
            @ApiResponse(responseCode = "404", description = "Fixed expense not found with the given ID"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Integer id) {
        logger.info("Deleting fixed expense with ID: " + id);

        try {
            FixedExpenseIdEstimatedBudgetDTO fixedExpense = fixedExpenseService.deleteFixedExpense(id);
            return ResponseEntity.ok(fixedExpense);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Fixed expense not found with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting fixed expense");
        }
    }

}
