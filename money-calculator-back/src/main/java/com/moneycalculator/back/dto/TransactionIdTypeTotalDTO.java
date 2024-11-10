package com.moneycalculator.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionIdTypeTotalDTO {

    private Integer id;

    private String type;

    private Double total;
}
