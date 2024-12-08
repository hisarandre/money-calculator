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
import {addFixedExpense} from "@/store/FixedExpenseSlice.ts";

interface AddFixedExpenseProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const AddFixedExpense: React.FC<AddFixedExpenseProps> = ({isOpen, onOpenChange}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {addStatus, addError} = useSelector((state: RootState) => state.fixedExpense);

    const formSchema = fixedExpenseFormSchema;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: "",
            amount: 0,
            frequency: 1,
        },
    });

    useEffect(() => {
        if (addStatus === "failed") {
            toast({
                description: addError,
                variant: "destructive",
            });
        }

        if (addStatus === "succeeded") {
            onOpenChange(false);
            toast({description: "Fixed expense added successfully!", variant: "positive"});
        }
    }, [addStatus, addError, onOpenChange]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        await dispatch(addFixedExpense(data));
        form.reset();
    };

    return (
        <DialogCustom title="Add a new fixed expense" isOpen={isOpen} onOpenChange={onOpenChange}>
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

export default AddFixedExpense;