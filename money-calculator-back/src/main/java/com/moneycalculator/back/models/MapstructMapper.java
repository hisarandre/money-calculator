package com.moneycalculator.back.models;

import com.moneycalculator.back.dto.AccountLabelFeeDTO;
import com.moneycalculator.back.dto.TransactionDTO;
import com.moneycalculator.back.dto.TransactionIdTypeTotalDTO;
import com.moneycalculator.back.dto.TransactionTotalDTO;
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
}
