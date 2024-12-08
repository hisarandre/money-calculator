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

export const editFixedExpense = createAsyncThunk(
    `${PREFIX}/editFixedExpense`,
    async ({id, editedFixedExpense}: {
        id: number;
        editedFixedExpense: {
            label: string,
            amount: number,
            frequency: number
        }
    }, {rejectWithValue}) => {
        try {
            const response = await axios.put(`${FIXED_EXPENSE_URL}/${id}`, editedFixedExpense);
            return response.data;
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : "Failed to edit fixed expense";
            return rejectWithValue(errorMessage);
        }
    });

export const deleteFixedExpense = createAsyncThunk(
    `${PREFIX}/deleteFixedExpense`,
    async (id: number,
           {rejectWithValue}) => {
        try {
            const response = await axios.delete(`${FIXED_EXPENSE_URL}/${id}`);
            return response.data;
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : "Failed to delete fixed expense";
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
        deleteStatus: "idle",
        fetchError: null as string | null,
        addError: null as string | null,
        editError: null as string | null,
        deleteError: null as string | null,
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

        // editFixedExpense reducers
        builder
            .addCase(editFixedExpense.pending, (state) => {
                state.editStatus = "loading";
                state.editError = null;
            })
            .addCase(editFixedExpense.fulfilled, (state, action) => {
                state.editStatus = "succeeded";
                state.mainCurrencyCurrentWallet = action.payload.mainCurrencyCurrentWallet;
                state.secondaryCurrencyCurrentWallet = action.payload.secondaryCurrencyCurrentWallet;
                state.estimatedBudget = action.payload.estimatedBudget;
                state.mainCurrencyTotalExpenses = action.payload.mainCurrencyTotalExpenses;
                state.secondaryCurrencyTotalExpenses = action.payload.secondaryCurrencyTotalExpenses;
                const updatedFixedExpense = action.payload.fixedExpense;
                state.fixedExpenses = state.fixedExpenses.map((fixedExpense) => (fixedExpense.id === updatedFixedExpense.id ? updatedFixedExpense : fixedExpense));
            })
            .addCase(editFixedExpense.rejected, (state, action) => {
                state.editStatus = "failed";
                state.editError = (action.payload as string) || "Failed to add account";
            });

        // deleteFixedExpense reducers
        builder
            .addCase(deleteFixedExpense.pending, (state) => {
                state.deleteStatus = "loading";
                state.deleteError = null;
            })
            .addCase(deleteFixedExpense.fulfilled, (state, action) => {
                state.deleteStatus = "succeeded";
                state.mainCurrencyCurrentWallet = action.payload.mainCurrencyCurrentWallet;
                state.secondaryCurrencyCurrentWallet = action.payload.secondaryCurrencyCurrentWallet;
                state.estimatedBudget = action.payload.estimatedBudget;
                state.mainCurrencyTotalExpenses = action.payload.mainCurrencyTotalExpenses;
                state.secondaryCurrencyTotalExpenses = action.payload.secondaryCurrencyTotalExpenses;
                const fixedExpenseId = action.payload.id;
                state.fixedExpenses = state.fixedExpenses.filter((fixedExpense) => fixedExpense.id !== fixedExpenseId);
            })
            .addCase(deleteFixedExpense.rejected, (state, action) => {
                state.deleteStatus = "failed";
                state.deleteError = (action.payload as string) || "Failed to delete fixed expense";
            });
    },
});

export default fixedExpenseSlice.reducer;