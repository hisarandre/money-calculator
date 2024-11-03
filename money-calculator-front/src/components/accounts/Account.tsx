import React, { useEffect } from 'react';
import CardCustom from '@/components/CardCustom';
import TableCustom from '../TableCustom';
import { Button } from '../ui/button';
import AddAccount from './modals/AddAccount';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/Store';
import { fetchAccounts } from '@/store/AccountSlice';

const data = [
  { label: "wise", fee: 2.5 },
  { label: "revolut", fee: 25 },
];

const Account = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accounts, status, error } = useSelector((state: RootState) => state.accounts);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAccounts());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <p>Loading accounts...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  const columns = ["label", "fee"];

  const mappedData = accounts.map(d => {
    return {
      _id: d._id,
      label: d.label, 
      fee: d.fee + "%"
    };
  });
  
  return (
    <div>
      <CardCustom
        title="Accounts"
        description="All available accounts"
      >
        <TableCustom
          columns={columns}
          data={mappedData}
        >
        </TableCustom>
        <AddAccount></AddAccount>
      </CardCustom>
    
    </div>
  );
};

export default Account;
