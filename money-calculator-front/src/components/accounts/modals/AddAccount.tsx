import DialogCustom from '@/components/DialogCustom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormFieldCustom from '@/components/FormFieldCustom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/Store';
import { addAccount } from '@/store/AccountSlice';


interface AddAccountProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const AddAccount: React.FC<AddAccountProps> = ({ isOpen, onOpenChange }) => {
 const dispatch = useDispatch<AppDispatch>();


  const formSchema = z.object({
    label: z.string().min(1, { message: "Label is required" }),
    fee: z.preprocess((val) => Number(val), z.number({ required_error: "Fee is required" })),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      fee: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await dispatch(addAccount(data));
      onOpenChange(false); // Close the modal on success
    } catch (error) {
      console.error("Failed to add account:", error);
    }
  };

  return (
    <DialogCustom title="Add a new account" isOpen={isOpen} onOpenChange={onOpenChange}>
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

export default AddAccount;
