import FixedBudgetCard from "@/components/budget/FixedBudgetCard.tsx";
import CurrentWalletCard from "@/components/wallet/CurrentWalletCard.tsx";
import FixedExpensesCard from "@/components/wallet/FixedExpensesCard.tsx";
import Calendar from "@/components/calendar/CalendarCard.tsx";
import ExpensesPerDayCard from "@/components/calendar/ExpensesPerDayCard.tsx";
import {useSelector} from "react-redux";
import {RootState} from "@/store/Store.ts";
import {fetchAllFixedExpenses, fetchWeek} from "@/store/ExpensesSlice.ts";
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
        fetchFixedStatus,
        fetchFixedError,
        dailyExpenses,
        fetchDailyStatus,
        fetchDailyError,
    } = useSelector((state: RootState) => state.expenses);
    const {
        mainCurrency,
        secondaryCurrency,
        fetchStatus: currenciesFetchStatus,
        fetchError: currenciesFetchError,
    } = useSelector((state: RootState) => state.budget);

    useFetchData({
        fetchStatus: fetchFixedStatus,
        fetchError: fetchFixedError,
        fetchAction: fetchAllFixedExpenses,
    });

    useFetchData({
        fetchStatus: currenciesFetchStatus,
        fetchError: currenciesFetchError,
        fetchAction: fetchBudget,
    });

    useFetchData({
        fetchStatus: fetchDailyStatus,
        fetchError: fetchDailyError,
        fetchAction: fetchWeek,
    });

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FixedBudgetCard />

            <FixedExpensesCard
                fixedExpenses={fixedExpenses}
                fixedExpensesFetchStatus={fetchFixedStatus}
                fixedExpensesFetchError={fetchFixedError}
                mainCurrency={mainCurrency}
                secondaryCurrency={secondaryCurrency}
                currenciesFetchStatus={currenciesFetchStatus}
                currenciesFetchError={currenciesFetchError}
            />

            <CurrentWalletCard
                mainCurrencyCurrentWallet={mainCurrencyCurrentWallet}
                secondaryCurrencyCurrentWallet={secondaryCurrencyCurrentWallet}
                estimatedBudget={estimatedBudget}
                mainCurrencyTotalExpenses={mainCurrencyTotalExpenses}
                secondaryCurrencyTotalExpenses={secondaryCurrencyTotalExpenses}
                fixedExpensesFetchStatus={fetchFixedStatus}
                fixedExpensesFetchError={fetchFixedError}
                mainCurrency={mainCurrency}
                secondaryCurrency={secondaryCurrency}
                currenciesFetchStatus={currenciesFetchStatus}
                currenciesFetchError={currenciesFetchError}
            />

            <Calendar />

            <ExpensesPerDayCard
                estimatedBudget={estimatedBudget}
                dailyExpenses={dailyExpenses}
                fetchDailyStatus={fetchDailyStatus}
                fetchDailyError={fetchDailyError}
                mainCurrency={mainCurrency}
                currenciesFetchStatus={currenciesFetchStatus}
                currenciesFetchError={currenciesFetchError}
            />
        </div>
    )
}

export default DailyBudget;