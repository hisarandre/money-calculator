import { configureStore } from "@reduxjs/toolkit";
import AccountSlice from "@/store/AccountSlice";
import TransactionSlice from "./TransactionSlice";

const Store = configureStore({
  reducer: {
    accounts: AccountSlice,
    transactions: TransactionSlice,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
