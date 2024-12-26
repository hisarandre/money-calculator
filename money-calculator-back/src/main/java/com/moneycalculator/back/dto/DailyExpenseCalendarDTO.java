package com.moneycalculator.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyExpenseCalendarDTO {

    private Integer id;

    private LocalDate start;

    private String title;

    private Double saving;

    private Integer weekNumber;

}
