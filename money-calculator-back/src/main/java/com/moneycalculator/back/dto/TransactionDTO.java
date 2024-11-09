package com.moneycalculator.back.dto;


import jakarta.persistence.Entity;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionDTO {

    @NotNull(message = "Label is required")
    @Size(min = 1, message = "Label cannot be empty")
    private String label;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Amount must be zero or greater")
    private Double amount;

    @NotNull(message = "Type is required")
    private String type;

    @NotNull(message = "Account id is required")
    private Integer accountId;
}
