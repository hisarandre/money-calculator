// src/store/slices/accountSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '@/utils/api'; 

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

// Async thunk to fetch account data from the API
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

// Slice definition
const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {}, // No additional reducers needed for now
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAccounts.fulfilled, (state, action: PayloadAction<AccountState[]>) => {
        state.status = 'succeeded';
        state.accounts = action.payload; // Store fetched accounts
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default accountSlice.reducer;
