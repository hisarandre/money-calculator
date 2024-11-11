import {Balance} from "@/models/Balance.tsx";

export interface History {
    id: number;
    date: string;
    total: number;
    earning: number;
    accountBalances: Balance[];
}