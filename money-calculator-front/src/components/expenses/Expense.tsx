import React from 'react'

const columns = ["label", "price", "account"];

const data = [
  { label: "Phone", price: 20.00, account: "Wise" },
  { label: "Icloud", price: 2.00, account: "Wise" },
];

const Expense = () => {

  const mappedData = data.map(d => {
    return {
      label: d.label, 
      price: d.price + "€",
      account: d.account,
    };
  });

  let total = 0;
  
  data.forEach(d => {
    total += d.price;
  })
  
  return (
    <div>

    </div>
  );
};

export default Expense;
