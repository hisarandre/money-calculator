import DialogCustom from "@/components/DialogCustom.tsx";
import {z} from "zod";
import {dailyExpenseFormSchema} from "@/utils/formSchemas.ts";
import FormFieldCustom from "@/components/FormFieldCustom.tsx";
import {formatAmount} from "@/utils/utils.ts";
import {Form} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CalendarDailyExpense} from "@/models/CalendarDailyExpense.ts";
import {format} from "date-fns";
import {Button} from "@/components/ui/button.tsx";
import {useEffect} from "react";

interface EditCalendarDailyExpenseProps {
    calendarDailyExpense: CalendarDailyExpense;
    mainCurrency: string;
    estimatedBudget: number;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    formSchema: typeof dailyExpenseFormSchema;
    onSubmit: (data: z.infer<typeof dailyExpenseFormSchema>) => void;
}

const EditCalendarDailyExpense: React.FC<EditCalendarDailyExpenseProps> = ({
    calendarDailyExpense,
    mainCurrency,
    estimatedBudget,
    isOpen,
    onOpenChange,
    formSchema,
    onSubmit
}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: calendarDailyExpense.start,
            amount: Number(calendarDailyExpense.title),
        },
    });

    useEffect(() => {
        if (calendarDailyExpense) {
            form.reset({
                ...form.getValues(),
                amount: Number(calendarDailyExpense.title),
            });
        }
    }, [calendarDailyExpense, form]);

    return (
        <DialogCustom title={`Edit expense: ${format(new Date(calendarDailyExpense.start), 'dd/MM/yyyy')}`} isOpen={isOpen} onOpenChange={onOpenChange}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap items-center gap-2">
                    <FormFieldCustom form={form} inputName="date" disabled={true} className="hidden" />
                    <FormFieldCustom form={form} inputName="amount" type="number" /> / {formatAmount(mainCurrency, estimatedBudget)}

                    <div className="w-full flex justify-end">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </DialogCustom>
    )
};

export default EditCalendarDailyExpense;