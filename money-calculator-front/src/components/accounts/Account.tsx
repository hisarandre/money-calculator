import React from 'react'
import CardCustom from '@/components/CardCustom';
import TableCustom from '../TableCustom';
import { Button } from '../ui/button';
import AddAccount from './modals/AddAccount';

const data = [
  { label: "wise", fee: 2.5 },
  { label: "revolut", fee: 25 },
];

const Account = () => {

  const columns = ["label", "fee"];

  const mappedData = data.map(d => {
    return {
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
