import {configureStore} from "@reduxjs/toolkit";
import AccountSlice from "@/store/AccountSlice";
import TransactionSlice from "@/store/TransactionSlice";
import BalanceSlide from "@/store/BalanceSlice.tsx";

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
