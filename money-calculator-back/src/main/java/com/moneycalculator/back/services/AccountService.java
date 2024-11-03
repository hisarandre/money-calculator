package com.moneycalculator.back.services;
import com.moneycalculator.back.models.Account;

import java.util.List;

public interface AccountService {
    List<Account> getAllAccounts();
}
