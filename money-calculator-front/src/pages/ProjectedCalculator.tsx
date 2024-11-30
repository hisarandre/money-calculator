import AccountCard from "@/components/accounts/AccountCard";
import ExpenseCard from "@/components/transactions/ExpenseCard";
import IncomeCard from "@/components/transactions/IncomeCard";
import HistoryCard from "@/components/balance/HistoryCard.tsx";
import BalanceOverviewCard from "@/components/balance/BalanceOverviewCard.tsx";
import CalculateCard from "@/components/balance/CalculateCard.tsx";

const ProjectedCalculator = () => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AccountCard/>
            <ExpenseCard/>
            <IncomeCard/>
            <HistoryCard/>
            <BalanceOverviewCard/>
            <CalculateCard/>
        </div>
    );
};

export default ProjectedCalculator;
