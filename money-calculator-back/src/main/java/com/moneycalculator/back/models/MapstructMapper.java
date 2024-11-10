package com.moneycalculator.back.models;

import com.moneycalculator.back.dto.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MapstructMapper {

    Account accountLabelFeeDTOToAccount(AccountLabelFeeDTO accountLabelFeeDTO);

    @Mapping(source = "transaction", target = "transaction")
    @Mapping(source = "total", target = "total")
    TransactionTotalDTO transactionToTransactionTotalDTO(Transaction transaction, Double total);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "type", target = "type")
    @Mapping(source = "total", target = "total")
    TransactionIdTypeTotalDTO transactionToTransactionIdTypeTotalDTO(Integer id, String type, Double total);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "date", source = "date")
    @Mapping(target = "total", source = "total")
    @Mapping(target = "accountBalances", source = "accountBalances")
    @Mapping(target = "earning", source = "earning")
    AccountBalanceHistoryDTO accountBalanceHistoryToDto(AccountBalanceHistory accountBalanceHistory);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "account", source = "account")
    @Mapping(target = "amount", source = "amount")
    AccountBalanceDTO accountBalanceToDto(AccountBalance accountBalance);

}
