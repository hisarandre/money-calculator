import React from "react";

import AccountCard from "@/components/accounts/AccountCard";
import ExpenseCard from "@/components/transactions/ExpenseCard";
import IncomeCard from "@/components/transactions/IncomeCard";

const ProjectedCalculator = () => {
  return (
    <div className="flex">
      <AccountCard />
      <ExpenseCard />
      <IncomeCard />
    </div>
  );
};

export default ProjectedCalculator;
