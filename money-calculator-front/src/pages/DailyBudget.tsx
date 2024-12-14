import FixedBudgetCard from "@/components/budget/FixedBudgetCard.tsx";
import CurrentWalletCard from "@/components/wallet/CurrentWalletCard.tsx";
import FixedExpensesCard from "@/components/wallet/FixedExpensesCard.tsx";
import Calendar from "@/components/calendar/CalendarCard.tsx";
import ExpensesPerDayCard from "@/components/calendar/ExpensesPerDayCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "@/store/Store.ts";
import {fetchAllFixedExpenses} from "@/store/FixedExpenseSlice.ts";
import {useFetchData} from "@/hooks/use-fetch-data.ts";
import {fetchBudget} from "@/store/BudgetSlice.ts";

const DailyBudget = () => {
    const {
        mainCurrencyCurrentWallet,
        secondaryCurrencyCurrentWallet,
        estimatedBudget,
        mainCurrencyTotalExpenses,
        secondaryCurrencyTotalExpenses,
        fixedExpenses,
        fetchStatus: fixedExpensesFetchStatus,
        fetchError: fixedExpensesFetchError,
    } = useSelector((state: RootState) => state.fixedExpense);
    const {
        mainCurrency,
        secondaryCurrency,
        fetchStatus: currenciesFetchStatus,
        fetchError: currenciesFetchError,
    } = useSelector((state: RootState) => state.budget);

    useFetchData({
        fetchStatus: fixedExpensesFetchStatus,
        fetchError: fixedExpensesFetchError,
        fetchAction: fetchAllFixedExpenses,
    });

    useFetchData({
        fetchStatus: currenciesFetchStatus,
        fetchError: currenciesFetchError,
        fetchAction: fetchBudget,
    });

    // TODO: mettre les fixed expenses en haut en 2 col
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FixedBudgetCard />

            <FixedExpensesCard
                fixedExpenses={fixedExpenses}
                fixedExpensesFetchStatus={fixedExpensesFetchStatus}
                fixedExpensesFetchError={fixedExpensesFetchError}
                mainCurrency={mainCurrency}
                secondaryCurrency={secondaryCurrency}
                currenciesFetchStatus={currenciesFetchStatus}
                currenciesFetchError={currenciesFetchError}
            />

            <div className="flex flex-col justify-center items-center text-center gap-4">
                <h1 className="text-lg">Korea</h1>

                <Button asChild>
                    <Link to="/reset-budget">Reset budget</Link>
                </Button>
            </div>

            <CurrentWalletCard
                mainCurrencyCurrentWallet={mainCurrencyCurrentWallet}
                secondaryCurrencyCurrentWallet={secondaryCurrencyCurrentWallet}
                estimatedBudget={estimatedBudget}
                mainCurrencyTotalExpenses={mainCurrencyTotalExpenses}
                secondaryCurrencyTotalExpenses={secondaryCurrencyTotalExpenses}
                fixedExpensesFetchStatus={fixedExpensesFetchStatus}
                fixedExpensesFetchError={fixedExpensesFetchError}
                mainCurrency={mainCurrency}
                secondaryCurrency={secondaryCurrency}
                currenciesFetchStatus={currenciesFetchStatus}
                currenciesFetchError={currenciesFetchError}
            />

            <Calendar />

            <ExpensesPerDayCard />
        </div>
    )
}

export default DailyBudget;