package com.moneycalculator.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountBalanceHistoryDTO {

    private Integer id;

    private LocalDate date;

    private Double total;

    private Double earning;

    private List<AccountBalanceDTO> accountBalances;
}
