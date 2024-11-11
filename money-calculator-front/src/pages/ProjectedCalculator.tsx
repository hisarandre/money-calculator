import React from "react";

import AccountCard from "@/components/accounts/AccountCard";
import ExpenseCard from "@/components/transactions/ExpenseCard";
import IncomeCard from "@/components/transactions/IncomeCard";
import HistoryCard from "@/components/balance/HistoryCard.tsx";
import BalanceOverviewCard from "@/components/balance/BalanceOverviewCard.tsx";
import CalculateCard from "@/components/balance/CalculateCard.tsx";

const ProjectedCalculator = () => {
    return (
        <div className="flex flex-wrap justify-evenly gap-6">
            <AccountCard/>
            <ExpenseCard/>
            <IncomeCard/>
            <BalanceOverviewCard/>
            <CalculateCard/>
            <HistoryCard/>
        </div>
    );
};

export default ProjectedCalculator;
