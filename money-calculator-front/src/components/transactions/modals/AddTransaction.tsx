import DialogCustom from "@/components/DialogCustom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormFieldCustom from "@/components/FormFieldCustom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/Store";
import { addTransaction } from "@/store/TransactionSlice";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { TransactionType } from "@/models/Transaction";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddTransactionProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ isOpen, onOpenChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { addStatus, addError } = useSelector((state: RootState) => state.accounts);

  const formSchema = z.object({
    label: z.string().min(1, { message: "Label is required" }),
    amount: z.preprocess((val) => Number(val), z.number({ required_error: "Amount is required" })),
    type: z.nativeEnum(TransactionType).default(TransactionType.INCOME),
    account: z.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      amount: 0,
      type: TransactionType.INCOME,
      account: 0,
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
    }
  }, [addStatus, addError, onOpenChange]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await dispatch(addTransaction(data));
  };

  return (
    <DialogCustom title="Add a new account" isOpen={isOpen} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormFieldCustom form={form} inputName="label" />
          <FormFieldCustom form={form} inputName="amount" type="number" />
          <FormFieldCustom form={form} inputName="account" />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </DialogCustom>
  );
};

export default AddTransaction;
