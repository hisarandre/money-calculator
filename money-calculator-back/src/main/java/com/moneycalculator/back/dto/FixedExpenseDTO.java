package com.moneycalculator.back.dto;

import jakarta.persistence.Column;
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
public class FixedExpenseDTO {

    private Integer id;

    private String label;

    private Double mainCurrencyAmount;

    private Double secondaryCurrencyAmount;

    private int frequency;

}
