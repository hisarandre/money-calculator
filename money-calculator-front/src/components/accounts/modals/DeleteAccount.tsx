import React from "react";
import DialogCustom from "@/components/DialogCustom";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/Store";
import { deleteAccount } from "@/store/AccountSlice";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface DeleteAccountProps {
  accountId: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({ accountId, isOpen, onOpenChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { deleteStatus, deletedError } = useSelector((state: RootState) => state.accounts);

  useEffect(() => {
    if (deleteStatus === "failed") {
      toast({
        description: deletedError,
        variant: "destructive",
      });
    }

    if (deleteStatus === "succeeded") {
      onOpenChange(false);
      toast({ title: "Account deleted successfully!", variant: "default" });
    }
  }, [deleteStatus, deletedError, onOpenChange]);

  const onDelete = async (accountId: number) => {
    await dispatch(deleteAccount(accountId));
  };

  return (
    <DialogCustom
      title="Delete account"
      description="Are you sure you want to delete this account?"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Button onClick={() => onDelete(accountId)}>Delete</Button>
    </DialogCustom>
  );
};

export default DeleteAccount;
