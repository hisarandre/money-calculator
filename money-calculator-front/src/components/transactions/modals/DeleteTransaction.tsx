import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store.tsx";
import {toast} from "@/hooks/use-toast.ts";
import {deleteTransaction} from "@/store/TransactionSlice.tsx";
import DialogCustom from "@/components/DialogCustom.tsx";
import {Button} from "@/components/ui/button.tsx";
import {DialogClose} from "@radix-ui/react-dialog";
import {TransactionType} from "@/models/Transaction.tsx";

interface DeleteTransactionProps {
    transactionId: number;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    type: TransactionType;
}

const DeleteTransaction: React.FC<DeleteTransactionProps> = ({transactionId, isOpen, onOpenChange, type}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {deleteStatus, deletedError} = useSelector((state: RootState) => state.transactions);

    useEffect(() => {
        if (deleteStatus === "failed") {
            toast({
                description: deletedError,
                variant: "destructive",
            });
        }

        if (deleteStatus === "succeeded") {
            onOpenChange(false);
            toast({description: "Transaction deleted successfully!", variant: "positive"});
        }
    }, [deleteStatus, deletedError, onOpenChange]);

    const onDelete = async (transactionId: number) => {
        await dispatch(deleteTransaction(transactionId));
    };

    return (
        <DialogCustom
            title={`Delete ${type}`}
            description={`Are you sure you want to delete this ${type}?`}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            preventOutsideInteraction={true}
        >
            <div className="flex justify-end gap-4">
                <Button variant="destructive" onClick={() => onDelete(transactionId)}>Delete</Button>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
            </div>
        </DialogCustom>
    );
};

export default DeleteTransaction;
