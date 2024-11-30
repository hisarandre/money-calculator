import DialogCustom from "@/components/DialogCustom";
import {Button} from "@/components/ui/button";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store.ts";
import {deleteAccount} from "@/store/AccountSlice.ts";
import {toast} from "@/hooks/use-toast";
import {useEffect} from "react";
import {DialogClose} from "@radix-ui/react-dialog";

interface DeleteAccountProps {
    accountId: number;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({accountId, isOpen, onOpenChange}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {deleteStatus, deletedError} = useSelector((state: RootState) => state.accounts);

    useEffect(() => {
        if (deleteStatus === "failed") {
            toast({
                description: deletedError,
                variant: "destructive",
            });
        }

        if (deleteStatus === "succeeded") {
            onOpenChange(false);
            toast({description: "Account deleted successfully!", variant: "positive"});
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
            preventOutsideInteraction={true}
        >
            <div className="flex justify-end gap-4">
                <Button variant="destructive" onClick={() => onDelete(accountId)}>Delete</Button>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
            </div>
        </DialogCustom>
    );
};

export default DeleteAccount;
