import {z} from "zod";
import {TransactionType} from "@/models/Transaction.tsx";
import {Account} from "@/models/Account.tsx";

export const createTransactionFormSchema = (type: TransactionType) => {
    return z.object({
        label: z.string().min(1, {message: "Label is required"}),
        amount: z.preprocess((val) => Number(val), z.number({required_error: "Amount is required"})),
        type: z.nativeEnum(TransactionType).default(type),
        accountId: z.preprocess((val) => Number(val), z.number()),
    });
};

export const accountFormSchema = z.object({
    label: z.string().min(1, {message: "Label is required"}),
    fee: z.preprocess((val) => Number(val), z.number({required_error: "Fee is required"})),
});

export const createBalanceOverviewFormSchema = (accounts: Account[]) => {
    return z.object(
        Object.fromEntries(
            accounts.map((account) => [
                String(account.id),
                z.preprocess((val) => Number(val), z.number({required_error: "Amount is required"})),
            ])
        )
    );
}
