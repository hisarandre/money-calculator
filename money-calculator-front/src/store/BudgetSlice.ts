import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {ACCOUNT_URL, BUDGET_URL} from "@/utils/api";
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
            const response = await axios.put(`${ACCOUNT_URL}/edit`, editedBudget);
            return response.data;
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : "Failed to edit budget";
            return rejectWithValue(errorMessage);
        }
    }
);

// Slice definition
const budgetSlice = createSlice({
    name: "budget",
    initialState: {
        budget: null as Budget | null,
        fetchStatus: "idle",
        editStatus: "idle",
        fetchError: null as string | null,
        editError: null as string | null,
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
            })
            .addCase(fetchBudget.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.fetchError = action.error.message || "Failed to fetch balance";
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
                state.editError = (action.payload as string) || "Failed to edit account";
            });
    },
});

export default budgetSlice.reducer;