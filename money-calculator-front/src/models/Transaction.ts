import {Account} from "@/models/Account";

export enum TransactionType {
    EXPENSE = "expense",
    INCOME = "income",
}

export interface Transaction {
    id: number;
    label: string;
    amount: number;
    account: Account;
    type: TransactionType;
}

export interface Income extends Transaction {
    type: TransactionType.INCOME;
}

export interface Expense extends Transaction {
    type: TransactionType.EXPENSE;
}
