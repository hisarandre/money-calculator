import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {BUDGET_URL} from "@/utils/api";
import {Budget} from "@/models/Budget";

const PREFIX = "budget";

export const fetchBudget = createAsyncThunk(
    `${PREFIX}/fetchBudget`,
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${BUDGET_URL}`);
            return response.data;
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : "Failed to fetch budget";
            return rejectWithValue(errorMessage);
        }
    });

export const editBudget = createAsyncThunk(
    `${PREFIX}/editBudget`,
    async (editedBudget: { label: string, endDate: string, amount: number }, {rejectWithValue}) => {
        try {
            await axios.put(`${BUDGET_URL}/edit`, editedBudget);
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : "Failed to edit budget";
            return rejectWithValue(errorMessage);
        }
    }
);

export const resetBudget = createAsyncThunk(
    `${PREFIX}/resetBudget`,
    async (resetBudget: {
        id: number,
        label: string,
        startDate: string,
        endDate: string,
        amount: number,
        conversion: boolean,
        mainCurrency: string,
        secondaryCurrency?: string | undefined
    }, {rejectWithValue}) => {
        try {
            await axios.post(`${BUDGET_URL}/reset`, resetBudget);
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : "Failed to reset budget";
            return rejectWithValue(errorMessage);
        }
    }
);

// Slice definition
const budgetSlice = createSlice({
    name: "budget",
    initialState: {
        budget: null as Budget | null,
        mainCurrency: null as string | null,
        secondaryCurrency: null as string | null,
        fetchStatus: "idle",
        editStatus: "idle",
        resetStatus: "idle",
        fetchError: null as string | null,
        editError: null as string | null,
        resetError: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // fetchBudget reducers
        builder
            .addCase(fetchBudget.pending, (state) => {
                state.fetchStatus = "loading";
                state.fetchError = null;
            })
            .addCase(fetchBudget.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                state.budget = action.payload;
                state.mainCurrency = action.payload.mainCurrency;
                state.secondaryCurrency = action.payload.secondaryCurrency;
            })
            .addCase(fetchBudget.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.fetchError = (action.payload as string) || "Failed to fetch budget";
            });

        // editBudget reducers
        builder
            .addCase(editBudget.pending, (state) => {
                state.editStatus = "loading";
                state.editError = null;
            })
            .addCase(editBudget.fulfilled, (state) => {
                state.editStatus = "succeeded";
            })
            .addCase(editBudget.rejected, (state, action) => {
                state.editStatus = "failed";
                state.editError = (action.payload as string) || "Failed to edit budget";
            });

        // resetBudget reducers
        builder
            .addCase(resetBudget.pending, (state) => {
                state.resetStatus = "loading";
                state.resetError = null;
            })
            .addCase(resetBudget.fulfilled, (state) => {
                state.resetStatus = "succeeded";
            })
            .addCase(resetBudget.rejected, (state, action) => {
                state.resetStatus = "failed";
                state.resetError = (action.payload as string) || "Failed to reset budget";
            });
    },
});

export default budgetSlice.reducer;