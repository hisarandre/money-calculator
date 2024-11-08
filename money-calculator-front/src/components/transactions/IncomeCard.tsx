import React, { useEffect, useState } from "react";
import CardCustom from "@/components/CardCustom";
import TableCustom from "../TableCustom";
import { toast } from "@/hooks/use-toast";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/Store";
import { fetchIncomes } from "@/store/TransactionSlice";
import { Button } from "@/components/ui/button";
import { Income, TransactionType } from "@/models/Transaction";
import AddTransaction from "@/components/transactions/modals/AddTransaction";
import DeleteTransaction from "@/components/transactions/modals/DeleteTransaction";
import EditTransaction from "@/components/transactions/modals/EditTransaction";
import { Account } from "@/models/Account";

const IncomeCard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { incomes, fetchIncomeStatus, fetchIncomeError } = useSelector((state: RootState) => state.transactions);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [incomeId, setIncomeId] = useState<number>(0);
  const [income, setIncome] = useState<Income>({
    label: "",
    amount: 0,
    type: TransactionType.INCOME,
    account: 0 as number,
  });

  useEffect(() => {
    if (fetchIncomeStatus === "idle") {
      dispatch(fetchIncomes());
    }
  }, [fetchIncomeStatus, dispatch]);

  useEffect(() => {
    if (fetchIncomeStatus === "failed") {
      toast({ title: "An error occurred", description: fetchIncomeError, variant: "destructive" });
    }
  }, [fetchIncomeStatus, fetchIncomeError]);

  const columns = ["label", "amount", "account"];
  const mappedData = incomes.map((i) => ({
    id: i.id,
    label: i.label,
    amount: i.amount,
    account: (i.account as Account).label,
    type: i.type,
  }));

  const onDelete = (id: number) => {
    setIncomeId(id);
    setIsDeleteDialogOpen(true);
  };

  const onEdit = (income: Income) => {
    setIncome(income);
    setIsEditDialogOpen(true);
  };

  return (
    <CardCustom title="Incomes" description="All incomes per month">
      {fetchIncomeStatus === "succeeded" && (
        <>
          <TableCustom
            columns={columns}
            data={mappedData}
            showFooter={true}
            total={0}
            canDelete={true}
            canEdit={true}
            onDelete={onDelete}
            onEdit={onEdit}
          />

          <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
            Add income
          </Button>

          <AddTransaction isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
          {/* <DeleteTransaction transactionId={incomeId} isOpen={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
          <EditTransaction transaction={income} isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} /> */}
        </>
      )}
      {fetchIncomeStatus === "loading" && <p>Loading incomes...</p>}
    </CardCustom>
  );
};

export default IncomeCard;
