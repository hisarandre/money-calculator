// src/store/slices/accountSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/utils/api'; 
import { Account } from '@/models/Account';

// Define the structure for individual account and the slice's state
interface AccountState {
  _id: number | null;
  label: string;
  fee: number;
}

interface AccountListState {
  accounts: AccountState[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: AccountListState = {
  accounts: [],
  status: 'idle',
  error: null,
};

export const fetchAccounts = createAsyncThunk(
  'account/fetchAccounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/account/all`);
      return response.data; 
    } catch (error) {
      return rejectWithValue('Failed to fetch accounts');
    }
  }
);

export const addAccount = createAsyncThunk(
  'accounts/addAccount',
  async (newAccount: Account, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/account/add`, newAccount);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to add account');
    }
  }
);


// Slice definition
const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAccounts.fulfilled, (state, action: PayloadAction<AccountState[]>) => {
        state.status = 'succeeded';
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add cases for addAccount
      .addCase(addAccount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addAccount.fulfilled, (state, action: PayloadAction<AccountState>) => {
        state.status = 'succeeded';
        state.accounts.push(action.payload); // Add the new account to the list
      })
      .addCase(addAccount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add account';
      });
  },
});


export default accountSlice.reducer;
