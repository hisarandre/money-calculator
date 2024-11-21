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
public class FixedExpenseLabelAmountFrequencyDTO {

    @NotNull(message = "Label is required")
    @Size(min = 1, message = "Label cannot be empty")
    private String label;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be zero or greater")
    private Double amount;

    @NotNull(message = "Frequency is required")
    @DecimalMin(value = "0", inclusive = false, message = "Frequency must be one or greater")
    private int frequency;

}
