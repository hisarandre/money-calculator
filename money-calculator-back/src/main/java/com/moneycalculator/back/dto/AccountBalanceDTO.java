package com.moneycalculator.back.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountBalanceDTO {

    @NotNull(message = "Account id is required")
    private Integer accountId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Amount must be zero or greater")
    private Double amount;
}
