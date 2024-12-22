import {FixedExpense} from "@/models/FixedExpense.ts";

export interface CurrentWallet {
    mainCurrencyCurrentWallet: number;
    secondaryCurrencyCurrentWallet: number;
    estimatedBudget: number;
    mainCurrencyTotalExpenses: number;
    secondaryCurrencyTotalExpenses: number;
    fixedExpenses: FixedExpense[];
}