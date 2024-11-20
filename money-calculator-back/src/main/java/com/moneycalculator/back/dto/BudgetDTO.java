package com.moneycalculator.back.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BudgetDTO {

    private Integer id;

    private String label;

    private LocalDate startDate;

    private LocalDate endDate;

    private Double mainCurrencyAmount;

    private Double secondaryCurrencyAmount;

    private Boolean conversion;

    private String mainCurrency;

    private String secondaryCurrency;

    private BigDecimal currencyRate;
}
