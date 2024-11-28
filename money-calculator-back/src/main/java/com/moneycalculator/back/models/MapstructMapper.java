package com.moneycalculator.back.models;

import com.moneycalculator.back.dto.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MapstructMapper {
    @Mapping(source = "amount", target = "mainCurrencyAmount")
    BudgetDTO budgetToBudgetDto(Budget budget);

    Account accountLabelFeeDTOToAccount(AccountLabelFeeDTO accountLabelFeeDTO);

    @Mapping(source = "transaction", target = "transaction")
    @Mapping(source = "total", target = "total")
    TransactionTotalDTO transactionToTransactionTotalDTO(Transaction transaction, Double total);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "type", target = "type")
    @Mapping(source = "total", target = "total")
    TransactionIdTypeTotalDTO transactionToTransactionIdTypeTotalDTO(Integer id, String type, Double total);

    @Mapping(target = "account", source = "account")
    @Mapping(target = "accountBalanceHistoryId", source = "accountBalanceHistoryId")
    @Mapping(target = "amount", source = "amount")
    AccountBalance accountBalanceDtoToAccountBalance(Account account, Integer accountBalanceHistoryId, Double amount);

    @Mapping(source = "amount", target = "mainCurrencyAmount")
    FixedExpenseDTO fixedExpenseToDTO(FixedExpense expense);

    List<FixedExpenseDTO> listFixedExpenseToDTOs(List<FixedExpense> expenses);

    FixedExpense fixedExpenseDTOToFixedExpense(FixedExpenseLabelAmountFrequencyDTO expense);

    DailyExpenseSavingDTO dailyExpenseToDTO(DailyExpense expense);

    List<DailyExpenseSavingDTO> dailyExpenseToDTOs(List<DailyExpense> expenses);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", expression = "java(String.valueOf(expenses.getAmount()))")
    @Mapping(target = "start", source = "date")
    DailyExpenseCalendarDTO dailyExpenseToCalendarDTO (DailyExpense expenses);

    List<DailyExpenseCalendarDTO> dailyExpenseToCalendarDTOs (List<DailyExpense> expenses);

}
