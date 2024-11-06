// src/store/slices/accountSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "@/utils/api";
import { Account } from "@/models/Account";

export const fetchAccounts = createAsyncThunk("account/fetchAccounts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/account/all`);
    return response.data;
  } catch (error) {
    return rejectWithValue("Failed to fetch accounts");
  }
});

export const addAccount = createAsyncThunk("accounts/addAccount", async (newAccount: Account, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/account/add`, newAccount);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || "Failed to add account";
    return rejectWithValue(errorMessage);
  }
});

export const deleteAccount = createAsyncThunk("accounts/deleteAccount", async (id: number, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${BASE_URL}/account/delete/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || "Failed to delete account";
    return rejectWithValue(errorMessage);
  }
});

export const editAccount = createAsyncThunk(
  "accounts/editAccount",
  async ({ id, editedAccount }: { id: number; editedAccount: Account }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/account/update/${id}`, editedAccount);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data || "Failed to edit account";
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice definition
const accountSlice = createSlice({
  name: "accounts",
  initialState: {
    accounts: [] as Account[],
    fetchStatus: "idle",
    addStatus: "idle",
    deleteStatus: "idle",
    editStatus: "idle",
    fetchError: null as string | null,
    addError: null as string | null,
    deletedError: null as string | null,
    editError: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchAccounts reducers
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.error.message || "Failed to fetch accounts";
      });

    // addAccount reducers
    builder
      .addCase(addAccount.pending, (state) => {
        state.addStatus = "loading";
        state.addError = null;
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
        state.accounts.push(action.payload);
      })
      .addCase(addAccount.rejected, (state, action) => {
        state.addStatus = "failed";
        state.addError = (action.payload as string) || "Failed to add account";
      });

    // deleteAccount reducers
    builder
      .addCase(deleteAccount.pending, (state) => {
        state.deleteStatus = "loading";
        state.deletedError = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        console.log(action.payload);
        state.accounts = state.accounts.filter((account) => account._id !== action.payload);
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deletedError = (action.payload as string) || "Failed to delete account";
      });

    // editAccount reducers
    builder
      .addCase(editAccount.pending, (state) => {
        state.editStatus = "loading";
        state.editError = null;
      })
      .addCase(editAccount.fulfilled, (state, action) => {
        state.editStatus = "succeeded";
        const updatedAccount = action.payload; // assuming action.payload contains the edited account
        state.accounts = state.accounts.map((account) => (account._id === updatedAccount._id ? updatedAccount : account));
      })
      .addCase(editAccount.rejected, (state, action) => {
        state.editStatus = "failed";
        state.editError = (action.payload as string) || "Failed to edit account";
      });
  },
});

export default accountSlice.reducer;
