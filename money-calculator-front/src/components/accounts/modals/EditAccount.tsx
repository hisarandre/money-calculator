import {Account} from "@/models/Account";
import DialogCustom from "@/components/DialogCustom";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import FormFieldCustom from "@/components/FormFieldCustom";
import {useSelector, useDispatch} from "react-redux";
import {RootState, AppDispatch} from "@/store/Store.ts";
import {editAccount} from "@/store/AccountSlice.ts";
import {toast} from "@/hooks/use-toast";
import {useEffect} from "react";
import {accountFormSchema} from "@/utils/formSchemas.ts";

interface EditAccountProps {
    account: Account;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const EditAccount: React.FC<EditAccountProps> = ({account, isOpen, onOpenChange}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {editStatus, editError} = useSelector((state: RootState) => state.accounts);

    const formSchema = accountFormSchema;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: account.label,
            fee: account.fee,
        },
    });

    useEffect(() => {
        if (account) {
            form.reset({
                label: account.label,
                fee: account.fee,
            });
        }
    }, [account, form]);

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
        dispatch(editAccount({id: account.id as number, editedAccount: data}));
    };

    return (
        <DialogCustom title="Edit account" isOpen={isOpen} onOpenChange={onOpenChange}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormFieldCustom form={form} inputName="label" label="label"/>
                    <FormFieldCustom form={form} inputName="fee" label="fee" type="number"/>

                    <div className="flex justify-end">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </DialogCustom>
    );
};
export default EditAccount;
