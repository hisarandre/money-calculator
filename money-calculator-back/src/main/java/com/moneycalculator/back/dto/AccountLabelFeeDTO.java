package com.moneycalculator.back.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountLabelFeeDTO {

    @NotNull(message = "Label is required")
    @Size(min = 1, message = "Label cannot be empty")
    private String label;

    @NotNull(message = "Fee is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Fee must be zero or greater")
    private Double fee;

}