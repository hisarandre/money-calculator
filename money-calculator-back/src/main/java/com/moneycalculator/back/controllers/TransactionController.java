package com.moneycalculator.back.controllers;

import com.moneycalculator.back.dto.TransactionDTO;
import com.moneycalculator.back.dto.TransactionIdTypeTotalDTO;
import com.moneycalculator.back.dto.TransactionListTotalDTO;
import com.moneycalculator.back.dto.TransactionTotalDTO;
import com.moneycalculator.back.models.Transaction;
import com.moneycalculator.back.services.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
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
@RequestMapping("/api/transaction")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;
    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    @GetMapping("/all")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of transactions retrieved successfully", content = @Content),
            @ApiResponse(responseCode = "204", description = "No transaction found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        logger.info("Get all transactions");
        List<Transaction> transactions = transactionService.getAllTransactions();

        if (transactions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(transactions);
    }

    @Operation(summary = "Get transactions by type", description = "Retrieves transactions of a specific type (expense or income).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "No transaction found", content = @Content),
            @ApiResponse(responseCode = "200", description = "List of transactions retrieved successfully", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid type parameter", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/type/{type}")
    public ResponseEntity<TransactionListTotalDTO> getTransactionsByType(@PathVariable String type) {
        logger.info("Get all transactions by type: " + type);

        TransactionListTotalDTO transactionsTotal = transactionService.getTransactionsByType(type);

        return ResponseEntity.ok(transactionsTotal);
    }

    @PostMapping("/add")
    @Operation(summary = "Add a new transaction", description = "Creates a new transaction.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transaction added successfully", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid transaction data", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> addTransaction(@Valid @RequestBody TransactionDTO transaction) {
        logger.info("Adding new transaction: " + transaction);
        try {
            TransactionTotalDTO newTransaction = transactionService.addTransaction(transaction);
            return ResponseEntity.status(201).body(newTransaction);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error adding transaction: ", e);
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a transaction",
            description = "Update the details of an existing transaction using its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transaction updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "Transaction not found")
    })
    public ResponseEntity<?> updateTransaction(@PathVariable Integer id,@Valid @RequestBody TransactionDTO transaction) {
        logger.info("Updating transaction with ID: " + id);
        try {
            TransactionTotalDTO updatedTransaction = transactionService.updateTransaction(id, transaction);
            return ResponseEntity.ok(updatedTransaction);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Transaction not found");
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a transaction",
            description = "Delete an existing transaction using its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transaction deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Transaction not found"),
            @ApiResponse(responseCode = "400", description = "Cannot delete transaction due to dependencies"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> deleteTransaction(@PathVariable Integer id) {
        try {
            TransactionIdTypeTotalDTO transaction = transactionService.deleteTransaction(id);
            return ResponseEntity.ok(transaction);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Transaction not found with ID: " + id);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("Cannot delete transaction as it has dependent transactions.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting transaction");
        }
    }

}
