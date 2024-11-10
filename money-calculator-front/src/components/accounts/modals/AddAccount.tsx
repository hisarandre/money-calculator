import DialogCustom from "@/components/DialogCustom";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import FormFieldCustom from "@/components/FormFieldCustom";
import {useSelector, useDispatch} from "react-redux";
import {RootState, AppDispatch} from "@/store/Store";
import {addAccount} from "@/store/AccountSlice";
import {toast} from "@/hooks/use-toast";
import {useEffect} from "react";
import {accountFormSchema} from "@/utils/formSchemas.ts";

interface AddAccountProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const AddAccount: React.FC<AddAccountProps> = ({isOpen, onOpenChange}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {addStatus, addError} = useSelector((state: RootState) => state.accounts);

    const formSchema = accountFormSchema;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: "",
            fee: 0,
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
            toast({description: "Account added successfully!", variant: "positive"});
        }
    }, [addStatus, addError, onOpenChange]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        await dispatch(addAccount(data));
        form.reset();
    };

    return (
        <DialogCustom title="Add a new account" isOpen={isOpen} onOpenChange={onOpenChange}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormFieldCustom form={form} inputName="label"/>
                    <FormFieldCustom form={form} inputName="fee" type="number"/>

                    <div className="flex justify-end">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </DialogCustom>
    );
};

export default AddAccount;
