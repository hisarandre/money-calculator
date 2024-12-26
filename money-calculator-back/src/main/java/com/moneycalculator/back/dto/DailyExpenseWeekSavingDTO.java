package com.moneycalculator.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyExpenseWeekSavingDTO {


    private Double totalSaving;

    private LocalDate startDate;

    private LocalDate endDate;

    private Double totalExpense;

}
