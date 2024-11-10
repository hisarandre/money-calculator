package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.AccountBalanceHistoryDTO;
import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.models.AccountBalanceHistory;

import java.util.List;

public interface AccountBalanceHistoryService {

    List<AccountBalanceHistoryDTO> getAll();

    List<AccountBalanceHistory> getAccountBalanceHistoriesFromLast12Months();
}
