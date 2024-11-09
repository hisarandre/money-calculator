package com.moneycalculator.back.controllers;

import com.moneycalculator.back.dto.AccountLabelFeeDTO;
import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.services.AccountServiceImpl;
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
@RequestMapping("/api/account")
public class AccountController {

    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);
    private final AccountServiceImpl accountService;

    @Autowired
    public AccountController(AccountServiceImpl accountService) {
        this.accountService = accountService;
    }

    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Accounts retrieved successfully",
                    content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = Account.class))
                    }
            ),
            @ApiResponse(responseCode = "204", description = "No accounts found", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden", content = @Content)
    })
    @GetMapping("/all")
    public ResponseEntity<List<Account>> getAllAccounts() {
        logger.info("Get all accounts");

        List<Account> accounts = accountService.getAllAccounts();

        if (accounts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(accounts);
    }


    @Operation(
            summary = "Add a new account",
            description = "Creates a new account with the provided label and fee details. The request body must contain an AccountLabelFeeDTO object with account label and fee."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Account created successfully",
                    content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = Account.class))
                    }
            ),
            @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden", content = @Content),
            @ApiResponse(responseCode = "409", description = "Conflict - Account already exists", content = @Content)
    })
    @PostMapping("/add")
    public ResponseEntity<?> createAccount(@Valid @RequestBody AccountLabelFeeDTO accountFeeLabel) {
        logger.info("Adding new account: " + accountFeeLabel);

        try {
            Account account = accountService.addAccount(accountFeeLabel);
            return ResponseEntity.status(HttpStatus.CREATED).body(account);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @Operation(
            summary = "Update an account",
            description = "Updates the account with the provided ID. The request body should contain the updated account details. Returns the updated account on success."
    )
    @ApiResponses(value = {

            @ApiResponse(
                    responseCode = "200",
                    description = "Account updated successfully",
                    content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = Account.class))
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
    public ResponseEntity<?> updateAccount(@PathVariable Integer id, @Valid @RequestBody Account account) {
        logger.info("Updating account with ID: " + id);

        try {
            Account updatedAccount = accountService.updateAccount(id, account);
            return ResponseEntity.ok(updatedAccount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found");
        }
    }


    @Operation(summary = "Delete an account", description = "Deletes the account with the given ID. Handles not found and foreign key constraint violations.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Account deleted successfully", content = @Content),
            @ApiResponse(responseCode = "404", description = "Account not found with the given ID"),
            @ApiResponse(responseCode = "400", description = "Cannot delete account due to dependent transactions"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Integer id) {
        logger.info("Deleting account with ID: " + id);

        try {
            accountService.deleteAccount(id);
            return ResponseEntity.ok(id);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found with ID: " + id);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("Cannot delete account as it has dependent transactions.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting account");
        }
    }

}
