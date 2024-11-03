import React from 'react'

const columns = ["label", "price", "account"];

const data = [
  { label: "INV001", price: 250.00, account: "Wise" },
  { label: "INV002", price: 250.00, account: "Wise" },
];

const Income = () => {

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

export default Income;
