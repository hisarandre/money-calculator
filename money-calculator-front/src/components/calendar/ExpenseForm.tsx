import {DailyExpense} from "@/models/DailyExpense.ts";
import {z} from "zod";
import {dailyExpenseFormSchema} from "@/utils/formSchemas.ts";
import {useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {format, isToday} from "date-fns";
import {formatAmount} from "@/utils/utils.ts";
import FormFieldCustom from "@/components/FormFieldCustom.tsx";
import {Form} from "@/components/ui/form.tsx";
import debounce from "lodash.debounce";
import {useEffect, useRef} from "react";

interface ExpenseFormProps {
    expense: DailyExpense;
    estimatedBudget: number;
    formSchema: typeof dailyExpenseFormSchema;
    mainCurrency: string;
    weekNumber: number;
    onSubmit: (data: z.infer<typeof dailyExpenseFormSchema>) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
    expense,
    estimatedBudget,
    formSchema,
    mainCurrency,
    weekNumber,
    onSubmit
}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: expense.date,
            amount: expense.amount ?? 0,
            weekNumber,
        },
    });

    const formState = useWatch({
        control: form.control,
    });

    const debouncedSubmit = useRef(
        debounce((data) => {
            form.handleSubmit(onSubmit)(data);
        }, 2000)
    );

    useEffect(() => {
        const debounced = debouncedSubmit.current;

        if (formState?.amount != null && formState.amount > 0) {
            debounced(formState);
        }

        return () => {
            debounced.cancel();
        };
    }, [formState]);

    return (
        <div
            className={`border-border border space-y-3 p-3 mb-2 rounded-md ${
                isToday(new Date(expense.date)) ? "bg-border" : ""
            }`}
        >
            <div>
                <span className="font-medium">{format(new Date(expense.date), "EEEE")}</span>
                <h4 className="uppercase font-medium text-muted-foreground text-sm">
                    {format(new Date(expense.date), "MMMM do, yyyy")}
                </h4>
            </div>

            <div className="flex gap-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                        <FormFieldCustom form={form} inputName="date" disabled={true} className="hidden" />
                        <FormFieldCustom form={form} inputName="amount" type="number" /> / {formatAmount(mainCurrency, estimatedBudget)}
                        <FormFieldCustom form={form} inputName="weekNumber" type="number" disabled={true} className="hidden" />
                    </form>
                </Form>

                <div className="flex-1 text-right text-muted-foreground">
                    <span className="font-medium text-sm">Saving</span>
                    <p className={expense.saving < 0 ? 'font-bold text-destructive' : ''}>{formatAmount(mainCurrency, expense.saving)}</p>
                </div>
            </div>
        </div>
    );
};

export default ExpenseForm;