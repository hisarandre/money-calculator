import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {DAILY_EXPENSE_URL, FIXED_EXPENSE_URL} from "@/utils/api.ts";
import {FixedExpense} from "@/models/FixedExpense.ts";
import {DailyExpense} from "@/models/DailyExpense.ts";
import {RootState} from "@/store/Store.ts";

const PREFIX_FE = "fixed-expense";
const PREFIX_DE = "daily-expense";

/* ----------------------------------------------- */
/*                  FIXED EXPENSES                 */
/* ----------------------------------------------- */
export const fetchAllFixedExpenses = createAsyncThunk(
    `${PREFIX_FE}/fetchAllFixedExpenses`,
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
    `${PREFIX_FE}/addFixedExpense`,
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
    `${PREFIX_FE}/editFixedExpense`,
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
    `${PREFIX_FE}/deleteFixedExpense`,
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

/* ----------------------------------------------- */
/*                  DAILY EXPENSES                 */
/* ----------------------------------------------- */
export const fetchWeek = createAsyncThunk(
    `${PREFIX_DE}/fetchWeek`,
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const weekNumber = state.expenses.weekNumber;

            const response = await axios.get(`${DAILY_EXPENSE_URL}/week/${weekNumber}`);
            return response.data;
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : "Failed to fetch week";
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateDailyExpense = createAsyncThunk(
    `${PREFIX_DE}/updateDailyExpense`,
    async (updatedDailyExpense: {
        date: string,
        amount: number,
        weekNumber: number
    }, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${DAILY_EXPENSE_URL}/week/set-expense`, updatedDailyExpense);
            return response.data;
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : "Failed to update daily expense";
            return rejectWithValue(errorMessage);
        }
    });

// Slice definition
const expensesSlice = createSlice({
    name: "expenses",
    initialState: {
        mainCurrencyCurrentWallet: 0,
        secondaryCurrencyCurrentWallet: 0,
        estimatedBudget: 0,
        mainCurrencyTotalExpenses: 0,
        secondaryCurrencyTotalExpenses: 0,
        fixedExpenses: [] as FixedExpense[],
        total: 0,
        totalSaving: 0,
        dailyExpenses: [] as DailyExpense[],
        isNextAvailable: false,
        isPreviousAvailable: false,
        weekNumber: 0,
        fetchFixedStatus: "idle",
        fetchDailyStatus: "idle",
        addStatus: "idle",
        editStatus: "idle",
        updateDailyStatus: "idle",
        deleteStatus: "idle",
        fetchFixedError: null as string | null,
        fetchDailyError: null as string | null,
        addError: null as string | null,
        editError: null as string | null,
        updateDailyError: null as string | null,
        deleteError: null as string | null,
    },
    reducers: {
        setWeekNumber(state, action: PayloadAction<number>) {
            state.weekNumber = action.payload;
        },
    },
    extraReducers: (builder) => {
        // fetchAllFixedExpenses reducers
        builder
            .addCase(fetchAllFixedExpenses.pending, (state) => {
                state.fetchFixedStatus = "loading";
                state.fetchFixedError = null;
            })
            .addCase(fetchAllFixedExpenses.fulfilled, (state, action) => {
                state.fetchFixedStatus = "succeeded";
                state.mainCurrencyCurrentWallet = action.payload.mainCurrencyCurrentWallet;
                state.secondaryCurrencyCurrentWallet = action.payload.secondaryCurrencyCurrentWallet;
                state.estimatedBudget = action.payload.estimatedBudget;
                state.mainCurrencyTotalExpenses = action.payload.mainCurrencyTotalExpenses;
                state.secondaryCurrencyTotalExpenses = action.payload.secondaryCurrencyTotalExpenses;
                state.fixedExpenses = action.payload.fixedExpenses;
            })
            .addCase(fetchAllFixedExpenses.rejected, (state, action) => {
                state.fetchFixedStatus = "failed";
                state.fetchFixedError = action.error.message || "Failed to fetch all fixed expenses";
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

        // fetchWeek reducers
        builder
            .addCase(fetchWeek.pending, (state) => {
                state.fetchDailyStatus = "loading";
                state.fetchDailyError = null;
            })
            .addCase(fetchWeek.fulfilled, (state, action) => {
                state.fetchDailyStatus = "succeeded";
                state.total = action.payload.total;
                state.totalSaving = action.payload.totalSaving;
                state.mainCurrencyCurrentWallet = action.payload.mainCurrencyCurrentWallet;
                state.secondaryCurrencyCurrentWallet = action.payload.secondaryCurrencyCurrentWallet;
                state.dailyExpenses = action.payload.dailyExpenses;
                state.isNextAvailable = action.payload.isNextAvailable;
                state.isPreviousAvailable = action.payload.isPreviousAvailable;
            })
            .addCase(fetchWeek.rejected, (state, action) => {
                state.fetchDailyStatus = "failed";
                state.fetchDailyError = action.error.message || "Failed to fetch week";
            });

        // updateDailyExpense reducers
        builder
            .addCase(updateDailyExpense.pending, (state) => {
                state.updateDailyStatus = "loading";
                state.updateDailyError = null;
            })
            .addCase(updateDailyExpense.fulfilled, (state, action) => {
                state.updateDailyStatus = "succeeded";
                state.total = action.payload.total;
                state.totalSaving = action.payload.totalSaving;
                state.mainCurrencyCurrentWallet = action.payload.mainCurrencyCurrentWallet;
                state.secondaryCurrencyCurrentWallet = action.payload.secondaryCurrencyCurrentWallet;
                state.dailyExpenses = action.payload.dailyExpenses;
                state.isNextAvailable = action.payload.isNextAvailable;
                state.isPreviousAvailable = action.payload.isPreviousAvailable;
            })
            .addCase(updateDailyExpense.rejected, (state, action) => {
                state.updateDailyStatus = "failed";
                state.updateDailyError = action.error.message || "Failed to update daily expense";
            });
    },
});

export default expensesSlice.reducer;
export const { setWeekNumber } = expensesSlice.actions;