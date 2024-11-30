import FixedBudgetCard from "@/components/budget/FixedBudgetCard.tsx";
import CurrentWalletCard from "@/components/wallet/CurrentWalletCard.tsx";
import FixedExpensesCard from "@/components/wallet/FixedExpensesCard.tsx";
import Calendar from "@/components/calendar/CalendarCard.tsx";
import ExpensesPerDayCard from "@/components/calendar/ExpensesPerDayCard.tsx";

const DailyBudget = () => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FixedBudgetCard />
            <CurrentWalletCard />
            <div>
                title
            </div>
            <FixedExpensesCard />
            <Calendar />
            <ExpensesPerDayCard />
        </div>
    )
}

export default DailyBudget;