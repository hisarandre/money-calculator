import FixedBudgetCard from "@/components/budget/FixedBudgetCard.tsx";
import CurrentWalletCard from "@/components/wallet/CurrentWalletCard.tsx";
import FixedExpensesCard from "@/components/wallet/FixedExpensesCard.tsx";
import Calendar from "@/components/calendar/CalendarCard.tsx";
import ExpensesPerDayCard from "@/components/calendar/ExpensesPerDayCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";

const DailyBudget = () => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FixedBudgetCard />

            <CurrentWalletCard />

            <div className="flex flex-col justify-center items-center text-center gap-4">
                <h1 className="text-lg">Korea</h1>

                <Button asChild>
                    <Link to="/reset-budget">Reset budget</Link>
                </Button>
            </div>

            <FixedExpensesCard />

            <Calendar />

            <ExpensesPerDayCard />
        </div>
    )
}

export default DailyBudget;