import DialogCustom from "@/components/DialogCustom";
import {Button} from "@/components/ui/button";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store.ts";
import {toast} from "@/hooks/use-toast";
import {useEffect} from "react";
import {DialogClose} from "@radix-ui/react-dialog";
import {deleteFixedExpense} from "@/store/ExpensesSlice.ts";

interface DeleteFixedExpenseProps {
    fixedExpenseId: number;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const DeleteFixedExpense: React.FC<DeleteFixedExpenseProps> = ({fixedExpenseId, isOpen, onOpenChange}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {deleteStatus, deleteError} = useSelector((state: RootState) => state.expenses);

    useEffect(() => {
        if (deleteStatus === "failed") {
            toast({
                description: deleteError,
                variant: "destructive",
            });
        }

        if (deleteStatus === "succeeded") {
            onOpenChange(false);
            toast({description: "Fixed expense deleted successfully!", variant: "positive"});
        }
    }, [deleteStatus, deleteError, onOpenChange]);

    const onDelete = async (fixedExpenseId: number) => {
        await dispatch(deleteFixedExpense(fixedExpenseId));
    };

    return (
        <DialogCustom
            title="Delete fixed expense"
            description="Are you sure you want to delete this fixed expense?"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            preventOutsideInteraction={true}
        >
            <div className="flex justify-end gap-4">
                <Button variant="destructive" onClick={() => onDelete(fixedExpenseId)}>Delete</Button>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
            </div>
        </DialogCustom>
    );
};

export default DeleteFixedExpense;
