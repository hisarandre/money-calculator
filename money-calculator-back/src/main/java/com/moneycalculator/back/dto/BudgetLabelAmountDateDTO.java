package com.moneycalculator.back.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BudgetLabelAmountDateDTO {

    @NotNull(message = "Label is required")
    private String label;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be zero or greater")
    private Double amount;

}
