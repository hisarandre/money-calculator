import {Account} from "@/models/Account";

export interface Balance {
    id: number;
    account: Account;
    accountBalanceHistoryId: number;
    amount: number;
}