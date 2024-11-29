package com.moneycalculator.back.dto;

import com.moneycalculator.back.models.DailyExpense;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyExpenseListDTO {

    List<DailyExpenseSavingDTO> dailyExpenses;

    private Double total;

    private Double totalSaving;

    private Double mainCurrencyCurrentWallet;

    private Double secondaryCurrencyCurrentWallet;

    private Boolean isNextAvailable;

    private Boolean isPreviousAvailable;
}
