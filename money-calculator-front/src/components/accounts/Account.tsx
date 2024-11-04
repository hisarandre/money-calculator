import React, { useEffect, useState } from 'react';
import CardCustom from '@/components/CardCustom';
import TableCustom from '../TableCustom';
import AddAccount from './modals/AddAccount';
import { toast } from "@/hooks/use-toast";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/Store';
import { fetchAccounts } from '@/store/AccountSlice';
import { Button } from "@/components/ui/button";

const Account = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accounts, status, error } = useSelector((state: RootState) => state.accounts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAccounts());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === 'failed') {
      toast({ title: 'An error occurred', description: error, variant: 'destructive' });
    }
  }, [status, error]);

  const columns = ["label", "fee"];
  const mappedData = accounts.map(d => ({
    _id: d._id,
    label: d.label,
    fee: d.fee + "%"
  }));

  return (
    <CardCustom 
      title="Accounts" 
      description="All available accounts"
    >
      {status === 'succeeded' && (
        <>
          <TableCustom 
            columns={columns} 
            data={mappedData} 
            canDelete={true} 
            canEdit={true} 
            onDelete={() => {}} 
            onEdit={() => {}} 
          />
          <Button 
            variant="outline" 
            onClick={() => setIsDialogOpen(true)}
          >
              Add Account
          </Button>

          <AddAccount 
            isOpen={isDialogOpen} 
            onOpenChange={setIsDialogOpen} 
          />
        </>
      )}
      {status === 'loading' && <p>Loading accounts...</p>}
    </CardCustom>
  );
};

export default Account;
