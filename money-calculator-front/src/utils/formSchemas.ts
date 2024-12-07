import {z} from "zod";
import {TransactionType} from "@/models/Transaction";
import {Account} from "@/models/Account";

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

export const calculateFormSchema = z.object({
    month: z.string().min(1, {message: "Month is required"}),
    year: z.string().min(1, {message: "Year is required"}),
}).refine(({month, year}) => {
    const inputDate = new Date(Number(year), Number(month) - 1);
    const currentDate = new Date();
    currentDate.setDate(1);

    return inputDate >= currentDate;
}, {
    message: "Please select a future month.",
    path: ["month"],
});

export const budgetFormSchema = z.object({
    label: z.string().min(1, {message: "Label is required"}),
    endDate: z.string().min(1, {message: "End date is required"}),
    amount: z.preprocess((val) => Number(val), z.number({required_error: "Amount is required"})),
});

export const resetBudgetFormSchema = z
    .object({
        id: z.preprocess((val) => Number(val), z.number({ required_error: "Id is required" })),
        label: z.string().min(1, { message: "Label is required" }),
        startDate: z.string().min(1, { message: "Start date is required" }),
        endDate: z.string().min(1, { message: "End date is required" }),
        amount: z.preprocess((val) => Number(val), z.number({ required_error: "Amount is required" })),
        conversion: z.boolean(),
        mainCurrency: z.string().min(1, { message: "Main currency is required" }),
        secondaryCurrency: z.string().optional(),
    })
    .refine(
        (data) => {
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);
            return !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && endDate > startDate;
        },
        {
            message: "End date must be later than start date",
            path: ["endDate"],
        }
    )
    .refine(
        (data) => {
            if (data.conversion) {
                return data.secondaryCurrency && data.secondaryCurrency.trim().length > 0;
            }
            return true;
        },
        {
            message: "Secondary currency is required when conversion is enabled",
            path: ["secondaryCurrency"],
        }
    );
