package com.moneycalculator.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FixedExpenseLabelAmountFrequencyDTO {

    private String label;

    private Double amount;

    private int frequency;

}
