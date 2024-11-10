package com.moneycalculator.back.services;
import com.moneycalculator.back.dto.AccountBalanceDTO;
import com.moneycalculator.back.dto.AccountBalanceHistoryDTO;
import com.moneycalculator.back.models.AccountBalanceHistory;

import java.time.LocalDate;
import java.util.List;

public interface AccountBalanceHistoryService {

    List<AccountBalanceHistory> getAll();

    List<AccountBalanceHistory> getAccountBalanceHistoriesFromLast12Months();

    boolean checkMonthlyDone();

    AccountBalanceHistory addAccountBalanceHistory(List<AccountBalanceDTO> accountBalanceDTOs);

    Double calculateAccountTotalAmount(List<AccountBalanceDTO> accountBalanceDTOs);

    Double calculateAccountEarningAmount(Double total);

    Double calculateProjectedAmount(LocalDate date);
}
