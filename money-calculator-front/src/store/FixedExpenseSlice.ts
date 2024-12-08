import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {FIXED_EXPENSE_URL} from "@/utils/api.ts";
import {FixedExpense} from "@/models/FixedExpense.ts";

const PREFIX = "fixed-expense";

export const fetchAllFixedExpenses = createAsyncThunk(
    `${PREFIX}/fetchAllFixedExpenses`,
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${FIXED_EXPENSE_URL}/all`);
            return response.data;
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : "Failed to fetch all fixed expenses";
            return rejectWithValue(errorMessage);
        }
    });

export const addFixedExpense = createAsyncThunk(
    `${PREFIX}/addFixedExpense`,
    async (newFixedExpense: {
        label: string,
        amount: number,
        frequency: number
    }, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${FIXED_EXPENSE_URL}/add`, newFixedExpense);
            return response.data;
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : "Failed to add fixed expense";
            return rejectWithValue(errorMessage);
        }
    });

// Slice definition
const fixedExpenseSlice = createSlice({
    name: "fixedExpense",
    initialState: {
        mainCurrencyCurrentWallet: 0,
        secondaryCurrencyCurrentWallet: 0,
        estimatedBudget: 0,
        mainCurrencyTotalExpenses: 0,
        secondaryCurrencyTotalExpenses: 0,
        fixedExpenses: [] as FixedExpense[],
        fetchStatus: "idle",
        addStatus: "idle",
        editStatus: "idle",
        fetchError: null as string | null,
        addError: null as string | null,
        editError: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // fetchAllFixedExpenses reducers
        builder
            .addCase(fetchAllFixedExpenses.pending, (state) => {
                state.fetchStatus = "loading";
                state.fetchError = null;
            })
            .addCase(fetchAllFixedExpenses.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                state.mainCurrencyCurrentWallet = action.payload.mainCurrencyCurrentWallet;
                state.secondaryCurrencyCurrentWallet = action.payload.secondaryCurrencyCurrentWallet;
                state.estimatedBudget = action.payload.estimatedBudget;
                state.mainCurrencyTotalExpenses = action.payload.mainCurrencyTotalExpenses;
                state.secondaryCurrencyTotalExpenses = action.payload.secondaryCurrencyTotalExpenses;
                state.fixedExpenses = action.payload.fixedExpenses;
            })
            .addCase(fetchAllFixedExpenses.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.fetchError = action.error.message || "Failed to fetch all fixed expenses";
            });

        // addFixedExpense reducers
        builder
            .addCase(addFixedExpense.pending, (state) => {
                state.addStatus = "loading";
                state.addError = null;
            })
            .addCase(addFixedExpense.fulfilled, (state, action) => {
                state.addStatus = "succeeded";
                state.mainCurrencyCurrentWallet = action.payload.mainCurrencyCurrentWallet;
                state.secondaryCurrencyCurrentWallet = action.payload.secondaryCurrencyCurrentWallet;
                state.estimatedBudget = action.payload.estimatedBudget;
                state.mainCurrencyTotalExpenses = action.payload.mainCurrencyTotalExpenses;
                state.secondaryCurrencyTotalExpenses = action.payload.secondaryCurrencyTotalExpenses;
                state.fixedExpenses.push(action.payload.fixedExpense);
            })
            .addCase(addFixedExpense.rejected, (state, action) => {
                state.addStatus = "failed";
                state.addError = (action.payload as string) || "Failed to add account";
            });
    },
});

export default fixedExpenseSlice.reducer;