import { Account } from "@/models/Account";
import DialogCustom from "@/components/DialogCustom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormFieldCustom from "@/components/FormFieldCustom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/Store";
import { editAccount } from "@/store/AccountSlice";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
interface EditAccountProps {
  account: Account;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const EditAccount: React.FC<EditAccountProps> = ({ account, isOpen, onOpenChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { editStatus, editError } = useSelector((state: RootState) => state.accounts);

  const formSchema = z.object({
    label: z.string().min(1, { message: "Label is required" }),
    fee: z.preprocess((val) => Number(val), z.number({ required_error: "Fee is required" })),
  });

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
  }, [editStatus, editError, onOpenChange]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    dispatch(editAccount({ id: account._id as number, editedAccount: data }));
  };

  return (
    <DialogCustom title="Edit account" isOpen={isOpen} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormFieldCustom form={form} inputName="label" />
          <FormFieldCustom form={form} inputName="fee" type="number" />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </DialogCustom>
  );
};
export default EditAccount;
