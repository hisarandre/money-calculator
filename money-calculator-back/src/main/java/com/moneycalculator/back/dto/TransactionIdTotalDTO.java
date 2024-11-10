package com.moneycalculator.back.dto;

import com.moneycalculator.back.models.Transaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionIdTotalDTO {

    private Integer id;

    private Double total;
}
