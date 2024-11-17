import {configureStore} from "@reduxjs/toolkit";
import AccountSlice from "@/store/AccountSlice.ts";
import TransactionSlice from "@/store/TransactionSlice.ts";
import BalanceSlide from "@/store/BalanceSlice.ts";

const Store = configureStore({
    reducer: {
        accounts: AccountSlice,
        transactions: TransactionSlice,
        balances: BalanceSlide,
    },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
