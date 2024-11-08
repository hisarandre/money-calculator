// src/store/slices/accountSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "@/utils/api";
import { Transaction, TransactionType } from "@/models/Transaction";
import { Expense, Income } from "@/models/Transaction";

export const fetchExpenses = createAsyncThunk("/type/expense", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/transaction/type/expense`);
    return response.data;
  } catch (error) {
    return rejectWithValue("Failed to fetch expenses");
  }
});

export const fetchIncomes = createAsyncThunk("/type/income", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/transaction/type/income`);
    return response.data;
  } catch (error) {
    return rejectWithValue("Failed to fetch incomes");
  }
});

export const addTransaction = createAsyncThunk("transactions/addTransaction", async (newTransaction: Transaction, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/transaction/add`, newTransaction);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || "Failed to add transaction";
    return rejectWithValue(errorMessage);
  }
});

export const deleteTransaction = createAsyncThunk("transactions/deleteTransaction", async (id: number, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${BASE_URL}/transaction/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || "Failed to delete transaction";
    return rejectWithValue(errorMessage);
  }
});

export const editAccount = createAsyncThunk(
  "transaction/editTransaction",
  async ({ id, editedTransaction }: { id: number; editedTransaction: Transaction }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/transaction/${id}`, editedTransaction);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data || "Failed to edit transaction";
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice definition
const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    incomes: [] as Income[],
    expenses: [] as Expense[],
    fetchIncomeStatus: "idle",
    fetchExpenseStatus: "idle",
    addStatus: "idle",
    deleteStatus: "idle",
    editStatus: "idle",
    fetchExpenseError: null as string | null,
    fetchIncomeError: null as string | null,
    addError: null as string | null,
    deletedError: null as string | null,
    editError: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchIncomes reducers
    builder
      .addCase(fetchIncomes.pending, (state) => {
        state.fetchIncomeStatus = "loading";
        state.fetchIncomeError = null;
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.fetchIncomeStatus = "succeeded";
        state.incomes = action.payload;
      })
      .addCase(fetchIncomes.rejected, (state, action) => {
        state.fetchIncomeStatus = "failed";
        state.fetchIncomeError = action.error.message || "Failed to fetch transactions";
      });

    // fetchexpensesreducers
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.fetchExpenseStatus = "loading";
        state.fetchExpenseError = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.fetchExpenseStatus = "succeeded";
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.fetchExpenseStatus = "failed";
        state.fetchExpenseError = action.error.message || "Failed to fetch transactions";
      });

    // addTransaction reducers
    builder
      .addCase(addTransaction.pending, (state) => {
        state.addStatus = "loading";
        state.addError = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
        if (action.payload.type === TransactionType.EXPENSE) {
          state.expenses.push(action.payload);
        } else {
          state.incomes.push(action.payload);
        }
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.addStatus = "failed";
        state.addError = (action.payload as string) || "Failed to add transaction";
      });

    // deleteAccount reducers
    builder
      .addCase(deleteTransaction.pending, (state) => {
        state.deleteStatus = "loading";
        state.deletedError = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        if (action.payload.type === TransactionType.EXPENSE) {
          state.expenses = state.expenses.filter((transaction: Expense) => transaction.id !== action.payload);
        } else {
          state.incomes = state.incomes.filter((transaction: Income) => transaction.id !== action.payload);
        }
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deletedError = (action.payload as string) || "Failed to delete transaction";
      });

    // editAccount reducers
    builder
      .addCase(editAccount.pending, (state) => {
        state.editStatus = "loading";
        state.editError = null;
      })
      .addCase(editAccount.fulfilled, (state, action) => {
        state.editStatus = "succeeded";
        const updatedTransaction = action.payload;

        if (action.payload.type === TransactionType.EXPENSE) {
          state.expenses = state.expenses.map((transaction: Expense) =>
            transaction.id === updatedTransaction._id ? updatedTransaction : transaction
          );
        } else {
          state.incomes = state.incomes.map((transaction: Income) =>
            transaction.id === updatedTransaction._id ? updatedTransaction : transaction
          );
        }
      })
      .addCase(editAccount.rejected, (state, action) => {
        state.editStatus = "failed";
        state.editError = (action.payload as string) || "Failed to edit transaction";
      });
  },
});

export default transactionSlice.reducer;
