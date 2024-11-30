import DialogCustom from "@/components/DialogCustom";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import FormFieldCustom from "@/components/FormFieldCustom";
import {useSelector, useDispatch} from "react-redux";
import {RootState, AppDispatch} from "@/store/Store.ts";
import {addTransaction} from "@/store/TransactionSlice.ts";
import {toast} from "@/hooks/use-toast";
import {useEffect} from "react";
import {TransactionType} from "@/models/Transaction";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Account} from "@/models/Account";
import {createTransactionFormSchema} from "@/utils/formSchemas.ts";

interface AddTransactionProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    type: TransactionType;
    accounts: Account[];
}

const AddTransaction: React.FC<AddTransactionProps> = ({isOpen, onOpenChange, type, accounts}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {addStatus, addError} = useSelector((state: RootState) => state.transactions);

    const formSchema = createTransactionFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: "",
            amount: 0,
            type: type,
            accountId: 0,
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
            form.reset();
            onOpenChange(false);
            toast({description: "Transaction added successfully!", variant: "positive"});
        }
    }, [addStatus, addError, form, onOpenChange]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        await dispatch(addTransaction(data));
    };

    return (
        <DialogCustom title={`Add a new ${type}`} isOpen={isOpen} onOpenChange={onOpenChange}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormFieldCustom form={form} inputName="label" label="label"/>
                    <FormFieldCustom form={form} inputName="amount" label="Amount" type="number"/>
                    <FormField
                        control={form.control}
                        name="accountId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Account</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an account"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {accounts.map((account) => (
                                            <SelectItem key={account.id}
                                                        value={String(account.id)}>{account.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </DialogCustom>
    );
};

export default AddTransaction;
