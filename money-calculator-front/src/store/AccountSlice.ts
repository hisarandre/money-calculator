import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {ACCOUNT_URL} from "@/utils/api";
import {Account} from "@/models/Account";

const PREFIX = "accounts";

export const fetchAccounts = createAsyncThunk(`${PREFIX}/fetchAccounts`, async (_, {rejectWithValue}) => {
    try {
        const response = await axios.get(`${ACCOUNT_URL}/all`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data || "Failed to fetch accounts";
        return rejectWithValue(errorMessage);
    }
});

export const addAccount = createAsyncThunk(`${PREFIX}/addAccount`, async (newAccount: Account, {rejectWithValue}) => {
    try {
        const response = await axios.post(`${ACCOUNT_URL}/add`, newAccount);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data || "Failed to add account";
        return rejectWithValue(errorMessage);
    }
});

export const deleteAccount = createAsyncThunk(`${PREFIX}/deleteAccount`, async (id: number, {rejectWithValue}) => {
    try {
        const response = await axios.delete(`${ACCOUNT_URL}/${id}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data || "Failed to delete account";
        return rejectWithValue(errorMessage);
    }
});

export const editAccount = createAsyncThunk(
    `${PREFIX}/editAccount`,
    async ({id, editedAccount}: { id: number; editedAccount: Account }, {rejectWithValue}) => {
        try {
            const response = await axios.put(`${ACCOUNT_URL}/${id}`, editedAccount);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data || "Failed to edit account";
            return rejectWithValue(errorMessage);
        }
    }
);

// Slice definition
const accountSlice = createSlice({
    name: "account",
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
                state.accounts = state.accounts.filter((account) => account.id !== action.payload);
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
                const updatedAccount = action.payload;
                state.accounts = state.accounts.map((account) => (account.id === updatedAccount.id ? updatedAccount : account));
            })
            .addCase(editAccount.rejected, (state, action) => {
                state.editStatus = "failed";
                state.editError = (action.payload as string) || "Failed to edit account";
            });
    },
});

export default accountSlice.reducer;
