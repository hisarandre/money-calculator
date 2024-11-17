import React, {useEffect} from "react";
import {Transaction} from "@/models/Transaction.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store.ts";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/hooks/use-toast.ts";
import {editTransaction} from "@/store/TransactionSlice.ts";
import DialogCustom from "@/components/DialogCustom.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import FormFieldCustom from "@/components/FormFieldCustom.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Account} from "@/models/Account.tsx";
import {createTransactionFormSchema} from "@/utils/formSchemas.ts";

interface EditTransactionProps {
    transaction: Transaction;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    accounts: Account[];
}

const EditTransaction: React.FC<EditTransactionProps> = ({transaction, isOpen, onOpenChange, accounts}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {editStatus, editError} = useSelector((state: RootState) => state.transactions);

    const formSchema = createTransactionFormSchema(transaction.type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: transaction.label,
            amount: transaction.amount,
            type: transaction.type,
            accountId: transaction.accountId,
        },
    });

    useEffect(() => {
        if (transaction) {
            form.reset({
                label: transaction.label,
                amount: transaction.amount,
                type: transaction.type,
                accountId: transaction.accountId,
            });
        }
    }, [transaction, form]);

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
        dispatch(editTransaction({id: transaction.id as number, editedTransaction: data}));
    };

    return (
        <DialogCustom title={`Edit ${transaction.type}`} isOpen={isOpen} onOpenChange={onOpenChange}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormFieldCustom form={form} inputName="label" label="label"/>
                    <FormFieldCustom form={form} inputName="amount" label="amount" type="number"/>
                    <FormField
                        control={form.control}
                        name="accountId"
                        render={({field}) => {
                            const selectedAccount = accounts.find(account => account.id === field.value);

                            return (
                                <FormItem>
                                    <FormLabel>Account</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={String(field.value)}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue>
                                                    {selectedAccount ? selectedAccount.label : "Select an account"}
                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {accounts.map((account) => (
                                                <SelectItem key={account.id} value={String(account.id)}>
                                                    {account.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            );
                        }}
                    />

                    <div className="flex justify-end">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </DialogCustom>
    );
};

export default EditTransaction;
