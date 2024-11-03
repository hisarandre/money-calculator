import { configureStore } from "@reduxjs/toolkit";
import AccountSlice from "@/store/AccountSlice";

const Store = configureStore({
  reducer: {
    accounts: AccountSlice,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
