import CardCustom from "@/components/CardCustom.tsx";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormFieldCustom from "@/components/FormFieldCustom";
import { useForm } from "react-hook-form";
import { userFormSchema } from "@/utils/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/Store.ts";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { editUser, fetchUser } from "@/store/UserSlice.ts";

function Settings() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    currentUser,
    editStatus,
    editError,
  } = useSelector((state: RootState) => state.users);

  const formSchema = userFormSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: currentUser?.displayName || '',
      photoURL: currentUser?.photoURL || '',
    },
  });

  // Fetch user when the currentUser changes
  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchUser());
    }
  }, [dispatch, currentUser?.id]);

  // Reset form when user data changes
  useEffect(() => {
    if (currentUser) {
      form.reset({
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
      });
    }
  }, [currentUser, form]);

  // Handle edit status and errors
  useEffect(() => {
    if (editStatus === "failed") {
      toast({
        description: editError,
        variant: "destructive",
      });
    }

    if (editStatus === "succeeded") {
      toast({
        description: "User information updated successfully",
        variant: "positive",
      });
    }
  }, [editStatus, editError]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (currentUser && currentUser.id) {
        dispatch(editUser({ userId: currentUser.id, userData: data }));
    }
};

  return (
    <div className="max-w-sm mx-auto p-6 flex flex-col gap-6">
      <CardCustom title="Settings" description="Edit user information">
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-8"
          >
            <FormFieldCustom 
              form={form} 
              inputName="displayName" 
              label="Display name" />
            <FormFieldCustom 
              form={form} 
              inputName="photoURL" 
              label="Photo URL" />
            <div className="flex justify-end">
              <Button type="submit" disabled={editStatus === "loading"}>
                {editStatus === "loading" ? "Updating..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </CardCustom>
    </div>
  );
}

export default Settings;
