import {useEffect, useState} from "react";
import CardCustom from "@/components/CardCustom";
import TableCustom from "../TableCustom";
import {toast} from "@/hooks/use-toast";
import {useSelector, useDispatch} from "react-redux";
import {RootState, AppDispatch} from "@/store/Store.ts";
import {fetchExpenses} from "@/store/TransactionSlice.ts";
import {Expense, TransactionType} from "@/models/Transaction.ts";
import AddTransaction from "@/components/transactions/modals/AddTransaction.tsx";
import EditTransaction from "@/components/transactions/modals/EditTransaction.tsx";
import DeleteTransaction from "@/components/transactions/modals/DeleteTransaction.tsx";

const ExpenseCard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        expenses,
        totalExpenses,
        fetchExpenseStatus,
        fetchExpenseError
    } = useSelector((state: RootState) => state.transactions);
    const {accounts} = useSelector((state: RootState) => state.accounts);
    const [isExpenseAddDialogOpen, setIsExpenseAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [expenseId, setExpenseId] = useState<number>(0);
    const [expense, setExpense] = useState<Expense>({
        id: 0,
        label: "",
        amount: 0,
        type: TransactionType.EXPENSE,
        account: {id: 0, label: "", fee: 0},
    });

    useEffect(() => {
        if (fetchExpenseStatus === "idle") {
            dispatch(fetchExpenses());
        }
    }, [fetchExpenseStatus, dispatch]);

    useEffect(() => {
        if (fetchExpenseStatus === "failed") {
            toast({title: "An error occurred", description: fetchExpenseError, variant: "destructive"});
        }
    }, [fetchExpenseStatus, fetchExpenseError]);

    const columns = ["label", "amount", "account"];
    const mappedData = expenses.map((i) => ({
        id: i.id,
        label: i.label,
        amount: i.amount,
        account: i.account,
        type: i.type,
    }));

    const onDelete = (id: number) => {
        setExpenseId(id);
        setIsDeleteDialogOpen(true);
    };

    const onEdit = (expense: Expense) => {
        const updatedExpense: Expense = {
            id: expense.id,
            label: expense.label,
            amount: expense.amount,
            type: expense.type,
            account: expense.account,
        };

        setExpense(updatedExpense);
        setIsEditDialogOpen(true);
    };

    return (
        <CardCustom
            title="Expenses"
            description="All fixed expenses per month"
            addAction={() => setIsExpenseAddDialogOpen(true)}
        >
            {fetchExpenseStatus === "succeeded" && (
                <>
                    <TableCustom<Expense>
                        columns={columns}
                        data={mappedData}
                        showFooter={true}
                        total={totalExpenses}
                        canDelete={true}
                        canEdit={true}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />

                    <AddTransaction
                        isOpen={isExpenseAddDialogOpen}
                        onOpenChange={setIsExpenseAddDialogOpen}
                        type={TransactionType.EXPENSE}
                        accounts={accounts}
                    />
                    <EditTransaction
                        transaction={expense}
                        isOpen={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        accounts={accounts}
                    />
                    <DeleteTransaction
                        transactionId={expenseId}
                        isOpen={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        type={TransactionType.EXPENSE}
                    />
                </>
            )}
            {fetchExpenseStatus === "loading" && <p>Loading expenses...</p>}
        </CardCustom>
    );
};

export default ExpenseCard;
