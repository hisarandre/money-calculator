package com.moneycalculator.back.services;

import com.moneycalculator.back.dto.AccountLabelFeeDTO;
import com.moneycalculator.back.models.Account;
import com.moneycalculator.back.models.MapstructMapper;
import com.moneycalculator.back.repositories.AccountRepository;
import com.moneycalculator.back.utils.BigDecimalUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import org.mapstruct.factory.Mappers;
import java.math.RoundingMode;

import java.util.List;
import java.util.Optional;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final MapstructMapper mapper = Mappers.getMapper(MapstructMapper.class);

    @Autowired
    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    @Override
    public Account addAccount(AccountLabelFeeDTO accountLabelFeeDTO) {
        // Check for duplicates
        Optional<Account> existingAccount = accountRepository.findByLabel(accountLabelFeeDTO.getLabel());

        if (existingAccount.isPresent()) {
            throw new IllegalArgumentException("An account with this label already exists.");
        }

        Double roundedFee = BigDecimalUtils.roundToTwoDecimalPlaces(accountLabelFeeDTO.getFee());
        accountLabelFeeDTO.setFee(roundedFee);

        Account account = mapper.accountLabelFeeDTOToAccount(accountLabelFeeDTO);

        return accountRepository.save(account);
    }

    @Override
    public Account updateAccount(Integer id, Account account) {
        Account existingAccount = accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with ID: " + id));

        Double roundedFee = BigDecimalUtils.roundToTwoDecimalPlaces(account.getFee());

        existingAccount.setLabel(account.getLabel());
        existingAccount.setFee(roundedFee);

        return accountRepository.save(existingAccount);
    }

    @Override
    public void deleteAccount(Integer id) {
        if (!accountRepository.existsById(id)) {
            throw new EntityNotFoundException("Account not found");
        }
        accountRepository.deleteById(id);
    }
}
