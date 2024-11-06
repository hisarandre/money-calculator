import React, { useEffect, useState } from "react";
import CardCustom from "@/components/CardCustom";
import TableCustom from "../TableCustom";
import { toast } from "@/hooks/use-toast";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/Store";
import { fetchExpenses } from "@/store/TransactionSlice";
import { Button } from "@/components/ui/button";
import { log } from "console";

const ExpenseCard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { expenses, fetchExpenseStatus, fetchExpenseError } = useSelector((state: RootState) => state.transactions);
  //   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  //   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  //   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  //   const [accountId, setAccountId] = useState<number>(0);
  //   const [account, setAccount] = useState<Account>({ label: "", fee: 0 });

  useEffect(() => {
    if (fetchExpenseStatus === "idle") {
      dispatch(fetchExpenses());
    }
  }, [fetchExpenseStatus, dispatch]);

  useEffect(() => {
    if (fetchExpenseStatus === "failed") {
      toast({ title: "An error occurred", description: fetchExpenseError, variant: "destructive" });
    }
  }, [fetchExpenseStatus, fetchExpenseError]);

  const columns = ["label", "amount", "account"];
  const mappedData = expenses.map((i) => ({
    id: i.id,
    label: i.label,
    amount: i.amount,
    account: i.account.label,
    type: i.type,
  }));

  //   const onDelete = (id: number) => {
  //     setAccountId(id);
  //     setIsDeleteDialogOpen(true);
  //   };

  //   const onEdit = (account: Account) => {
  //     setAccount(account);
  //     setIsEditDialogOpen(true);
  //   };

  return (
    <CardCustom title="Expenses" description="All expenses per month">
      {fetchExpenseStatus === "succeeded" && (
        <>
          <TableCustom columns={columns} data={mappedData} total={0} />

          {/* <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
            Add Account
          </Button> */}

          {/* <AddAccount isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
          <DeleteAccount accountId={accountId} isOpen={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
          <EditAccount account={account} isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} /> */}
        </>
      )}
      {fetchExpenseStatus === "loading" && <p>Loading accounts...</p>}
    </CardCustom>
  );
};

export default ExpenseCard;
