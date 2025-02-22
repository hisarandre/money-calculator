package com.moneycalculator.back.services;
import com.moneycalculator.back.dto.AccountLabelFeeDTO;
import com.moneycalculator.back.models.Account;

import java.util.List;

public interface AccountService {
    List<Account> getAllAccounts();

    Account addAccount(AccountLabelFeeDTO accountLabelFeeDTO);

    Account updateAccount(Integer _id, Account account);

    void deleteAccount(Integer _id);

}
