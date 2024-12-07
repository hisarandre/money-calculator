import DialogCustom from "@/components/DialogCustom";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import FormFieldCustom from "@/components/FormFieldCustom";
import {useSelector, useDispatch} from "react-redux";
import {RootState, AppDispatch} from "@/store/Store.ts";
import {toast} from "@/hooks/use-toast";
import {useEffect} from "react";
import {budgetFormSchema} from "@/utils/formSchemas.ts";
import {Budget} from "@/models/Budget";
import {editBudget} from "@/store/BudgetSlice.ts";
import {getCurrencySymbol, getDayAfter} from "@/utils/utils.ts";

interface EditBudgetProps {
    budget: Budget;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const EditBudget: React.FC<EditBudgetProps> = ({budget, isOpen, onOpenChange}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {editStatus, editError} = useSelector((state: RootState) => state.budget);

    const formSchema = budgetFormSchema;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: budget.label,
            endDate: getDayAfter(budget.endDate),
            amount: budget.mainCurrencyAmount,
        },
    });

    useEffect(() => {
        if (budget) {
            form.reset({
                label: budget.label,
                endDate: getDayAfter(budget.endDate),
                amount: budget.mainCurrencyAmount,
            });
        }
    }, [budget, form]);

    useEffect(() => {
        if (editStatus === "failed") {
            toast({
                description: editError,
                variant: "destructive",
            });
        }

        if (editStatus === "succeeded") {
            onOpenChange(false);
            window.location.reload();
        }
    }, [editStatus, editError, onOpenChange]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        dispatch(editBudget(data));
    };

    return (
        <DialogCustom title="Edit budget" isOpen={isOpen} onOpenChange={onOpenChange}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormFieldCustom form={form} inputName="label" label="label"/>
                    <FormFieldCustom form={form} inputName="endDate" label="end date" type="date" className="flex flex-col" disabledDates={(date) => date < new Date(budget.endDate)}/>
                    <FormFieldCustom form={form} inputName="amount"
                                     label={`amount (${budget.mainCurrency} - ${getCurrencySymbol(budget.mainCurrency)})`}
                                     type="number"/>

                    <div className="flex justify-end">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </DialogCustom>
    );
};

export default EditBudget;
