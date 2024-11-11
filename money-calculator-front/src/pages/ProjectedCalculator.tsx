import React from "react";

import AccountCard from "@/components/accounts/AccountCard";
import ExpenseCard from "@/components/transactions/ExpenseCard";
import IncomeCard from "@/components/transactions/IncomeCard";
import HistoryCard from "@/components/history/HistoryCard.tsx";
import BalanceOverviewCard from "@/components/history/BalanceOverviewCard.tsx";

const ProjectedCalculator = () => {
    return (
        <div className="flex flex-wrap justify-evenly gap-6">
            <AccountCard/>
            <ExpenseCard/>
            <IncomeCard/>
            <BalanceOverviewCard/>
            <HistoryCard/>
        </div>
    );
};

export default ProjectedCalculator;
