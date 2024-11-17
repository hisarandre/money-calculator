import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {BALANCE_URL} from "@/utils/api";
import {History} from "@/models/History";

const PREFIX = "balances";

export const fetchHistory = createAsyncThunk(
    `${PREFIX}/fetchHistory`,
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${BALANCE_URL}/all`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data || "Failed to fetch history";
            return rejectWithValue(errorMessage);
        }
    });

export const fetchMonthlyDone = createAsyncThunk(
    `${PREFIX}/fetchMonthlyDone`,
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${BALANCE_URL}/monthly-done`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data || "Failed to fetch monthly done";
            return rejectWithValue(errorMessage);
        }
    });

export const addBalance = createAsyncThunk(
    `${PREFIX}/add`,
    async (balances: { accountId: number; amount: number }[], {rejectWithValue}) => {
        try {
            const response = await axios.post(`${BALANCE_URL}/add`, balances);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data || "Failed to add balance";
            return rejectWithValue(errorMessage);
        }
    }
);

export const calculate = createAsyncThunk(
    `${PREFIX}/calculate`,
    async (date: string, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${BALANCE_URL}/calculate/${date}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data || "Failed to calculate";
            return rejectWithValue(errorMessage);
        }
    }
);

// Slice definition
const balanceSlice = createSlice({
    name: "balance",
    initialState: {
        history: [] as History[],
        monthlyDone: null as boolean | null,
        calculResult: 0,
        fetchStatus: "idle",
        monthlyDoneStatus: "idle",
        addStatus: "idle",
        calculateStatus: "idle",
        fetchError: null as string | null,
        monthlyDoneError: null as string | null,
        addError: null as string | null,
        calculateError: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // fetchHistory reducers
        builder
            .addCase(fetchHistory.pending, (state) => {
                state.fetchStatus = "loading";
                state.fetchError = null;
            })
            .addCase(fetchHistory.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                state.history = action.payload;
            })
            .addCase(fetchHistory.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.fetchError = action.error.message || "Failed to fetch balance";
            });

        // fetchMonthlyDone reducers
        builder
            .addCase(fetchMonthlyDone.pending, (state) => {
                state.monthlyDoneStatus = "loading";
                state.monthlyDoneError = null;
            })
            .addCase(fetchMonthlyDone.fulfilled, (state, action) => {
                state.monthlyDoneStatus = "succeeded";
                state.monthlyDone = action.payload;
            })
            .addCase(fetchMonthlyDone.rejected, (state, action) => {
                state.monthlyDoneStatus = "failed";
                state.monthlyDoneError = action.error.message || "Failed to fetch monthly done";
            });

        // addBalance reducers
        builder
            .addCase(addBalance.pending, (state) => {
                state.addStatus = "loading";
                state.addError = null;
            })
            .addCase(addBalance.fulfilled, (state) => {
                state.addStatus = "succeeded";
            })
            .addCase(addBalance.rejected, (state, action) => {
                state.addStatus = "failed";
                state.addError = (action.payload as string) || "Failed to add balance";
            });

        // calculate reducers
        builder
            .addCase(calculate.pending, (state) => {
                state.calculateStatus = "loading";
                state.calculateError = null;
            })
            .addCase(calculate.fulfilled, (state, action) => {
                state.calculateStatus = "succeeded";
                state.calculResult = action.payload;
            })
            .addCase(calculate.rejected, (state, action) => {
                state.calculateStatus = "failed";
                state.calculateError = (action.payload as string) || "Failed to calculate";
            });
    },
});

export default balanceSlice.reducer;