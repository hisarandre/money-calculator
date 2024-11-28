package com.moneycalculator.back.dto;

import com.moneycalculator.back.models.DailyExpense;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyExpenseSavingDTO {

    private LocalDate date;

    private Double amount;

    private Double saving;
}
