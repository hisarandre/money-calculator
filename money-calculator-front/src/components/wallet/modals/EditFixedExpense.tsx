import {FixedExpense} from "@/models/FixedExpense.ts";
import {Form} from "@/components/ui/form.tsx";
import FormFieldCustom from "@/components/FormFieldCustom.tsx";
import {Button} from "@/components/ui/button.tsx";
import DialogCustom from "@/components/DialogCustom.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store.ts";
import {fixedExpenseFormSchema} from "@/utils/formSchemas.ts";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";
import {toast} from "@/hooks/use-toast.ts";
import {editFixedExpense} from "@/store/ExpensesSlice.ts";

interface EditFixedExpenseProps {
    fixedExpense: FixedExpense;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const EditFixedExpense: React.FC<EditFixedExpenseProps> = ({fixedExpense, isOpen, onOpenChange}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {editStatus, editError} = useSelector((state: RootState) => state.expenses);

    const formSchema = fixedExpenseFormSchema;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: fixedExpense.label,
            amount: fixedExpense.mainCurrencyAmount,
            frequency: fixedExpense.frequency,
        },
    });

    useEffect(() => {
        if (fixedExpense) {
            form.reset({
                label: fixedExpense.label,
                amount: fixedExpense.mainCurrencyAmount,
                frequency: fixedExpense.frequency,
            });
        }
    }, [fixedExpense, form]);

    useEffect(() => {
        if (editStatus === "failed") {
            toast({
                description: editError,
                variant: "destructive",
            });
        }

        if (editStatus === "succeeded") {
            onOpenChange(false);
        }
    }, [editStatus, editError, onOpenChange]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        dispatch(editFixedExpense({id: fixedExpense.id, editedFixedExpense: data}));
    };

    return (
        <DialogCustom title="Edit fixed expense" isOpen={isOpen} onOpenChange={onOpenChange}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormFieldCustom form={form} inputName="label" label="label"/>
                    <FormFieldCustom form={form} inputName="amount" label="amount" type="number"/>
                    <FormFieldCustom form={form} inputName="frequency" label="frequency" type="number" description="The frequency is in months"/>

                    <div className="flex justify-end">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </DialogCustom>
    )
};

export default EditFixedExpense;