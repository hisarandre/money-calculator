import {Account} from "@/models/Account.tsx";

export interface Balance {
    id: number;
    account: Account;
    accountBalanceHistoryId: number;
    amount: number;
}