package com.moneycalculator.back.dto;

import com.moneycalculator.back.models.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountBalanceDTO {

    private Integer id;

    private Account account;

    private Double amount;
}
