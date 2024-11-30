import {useEffect, useState} from "react";
import CardCustom from "@/components/CardCustom";
import TableCustom from "../TableCustom";
import {toast} from "@/hooks/use-toast";
import {useSelector, useDispatch} from "react-redux";
import {RootState, AppDispatch} from "@/store/Store.ts";
import {fetchIncomes} from "@/store/TransactionSlice.ts";
import {Income, TransactionType} from "@/models/Transaction";
import AddTransaction from "@/components/transactions/modals/AddTransaction";
import DeleteTransaction from "@/components/transactions/modals/DeleteTransaction";
import EditTransaction from "@/components/transactions/modals/EditTransaction";

const IncomeCard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        incomes,
        totalIncomes,
        fetchIncomeStatus,
        fetchIncomeError
    } = useSelector((state: RootState) => state.transactions);
    const {accounts} = useSelector((state: RootState) => state.accounts);
    const [isIncomeAddDialogOpen, setIsIncomeAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [incomeId, setIncomeId] = useState<number>(0);
    const [income, setIncome] = useState<Income>({
        id: 0,
        label: "",
        amount: 0,
        type: TransactionType.INCOME,
        account: {id: 0, label: "", fee: 0},
    });

    useEffect(() => {
        if (fetchIncomeStatus === "idle") {
            dispatch(fetchIncomes());
        }
    }, [fetchIncomeStatus, dispatch]);

    useEffect(() => {
        if (fetchIncomeStatus === "failed") {
            toast({title: "An error occurred", description: fetchIncomeError, variant: "destructive"});
        }
    }, [fetchIncomeStatus, fetchIncomeError]);

    const columns = ["label", "amount", "account"];
    const mappedData = incomes.map((i) => ({
        id: i.id,
        label: i.label,
        amount: i.amount,
        account: i.account,
        type: i.type,
    }));

    const onDelete = (id: number) => {
        setIncomeId(id);
        setIsDeleteDialogOpen(true);
    };

    const onEdit = (income: Income) => {
        const updatedIncome: Income = {
            id: income.id,
            label: income.label,
            amount: income.amount,
            type: income.type,
            account: income.account,
        };

        setIncome(updatedIncome);
        setIsEditDialogOpen(true);
    };

    return (
        <CardCustom
            title="Incomes"
            description="All fixed incomes per month"
            addAction={() => setIsIncomeAddDialogOpen(true)}
        >
            {fetchIncomeStatus === "succeeded" && (
                <>
                    <TableCustom<Income>
                        columns={columns}
                        data={mappedData}
                        showFooter={true}
                        total={totalIncomes}
                        canDelete={true}
                        canEdit={true}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />

                    <AddTransaction
                        isOpen={isIncomeAddDialogOpen}
                        onOpenChange={setIsIncomeAddDialogOpen}
                        type={TransactionType.INCOME}
                        accounts={accounts}
                    />
                    <EditTransaction
                        transaction={income}
                        isOpen={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        accounts={accounts}
                    />
                    <DeleteTransaction
                        transactionId={incomeId}
                        isOpen={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        type={TransactionType.INCOME}
                    />
                </>
            )}
            {fetchIncomeStatus === "loading" && <p>Loading incomes...</p>}
        </CardCustom>
    );
};

export default IncomeCard;
