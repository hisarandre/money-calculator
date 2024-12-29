import {configureStore} from "@reduxjs/toolkit";
import AccountSlice from "@/store/AccountSlice.ts";
import TransactionSlice from "@/store/TransactionSlice.ts";
import BalanceSlide from "@/store/BalanceSlice.ts";
import BudgetSlice from "@/store/BudgetSlice.ts";
import ExpensesSlice from "@/store/ExpensesSlice.ts";
import UserSlice from "@/store/UserSlice.ts";

const Store = configureStore({
    reducer: {
        accounts: AccountSlice,
        transactions: TransactionSlice,
        balances: BalanceSlide,
        budget: BudgetSlice,
        expenses: ExpensesSlice,
        users: UserSlice,
    },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
