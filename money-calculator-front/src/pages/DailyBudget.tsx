import FixedBudgetCard from "@/components/budget/FixedBudgetCard.tsx";
import CurrentWalletCard from "@/components/wallet/CurrentWalletCard.tsx";
import FixedExpensesCard from "@/components/wallet/FixedExpensesCard.tsx";
import Calendar from "@/components/calendar/CalendarCard.tsx";
import ExpensesPerDayCard from "@/components/calendar/ExpensesPerDayCard.tsx";
import {useSelector} from "react-redux";
import {RootState} from "@/store/Store.ts";
import {fetchAllFixedExpenses, fetchCalendar, fetchWeek} from "@/store/ExpensesSlice.ts";
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
        calendarDailyExpenses,
        fetchCalendarDailyStatus,
        fetchCalendarDailyError,
        updateDailyStatus,
        updateDailyError
    } = useSelector((state: RootState) => state.expenses);
    const {
        mainCurrency,
        secondaryCurrency,
        budget,
        fetchStatus: budgetFetchStatus,
        fetchError: budgetFetchError,
    } = useSelector((state: RootState) => state.budget);

    useFetchData({
        fetchStatus: fetchFixedStatus,
        fetchError: fetchFixedError,
        fetchAction: fetchAllFixedExpenses,
    });

    useFetchData({
        fetchStatus: budgetFetchStatus,
        fetchError: budgetFetchError,
        fetchAction: fetchBudget,
    });

    useFetchData({
        fetchStatus: fetchDailyStatus,
        fetchError: fetchDailyError,
        fetchAction: fetchWeek,
    });

    useFetchData({
        fetchStatus: fetchCalendarDailyStatus,
        fetchError: fetchCalendarDailyError,
        fetchAction: fetchCalendar,
    });

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FixedBudgetCard />

            <FixedExpensesCard
                fixedExpenses={fixedExpenses}
                mainCurrencyTotalExpenses={mainCurrencyTotalExpenses}
                secondaryCurrencyTotalExpenses={secondaryCurrencyTotalExpenses}
                fixedExpensesFetchStatus={fetchFixedStatus}
                fixedExpensesFetchError={fetchFixedError}
                mainCurrency={mainCurrency}
                secondaryCurrency={secondaryCurrency}
                budgetFetchStatus={budgetFetchStatus}
                budgetFetchError={budgetFetchError}
            />

            <CurrentWalletCard
                mainCurrencyCurrentWallet={mainCurrencyCurrentWallet}
                secondaryCurrencyCurrentWallet={secondaryCurrencyCurrentWallet}
                estimatedBudget={estimatedBudget}
                fixedExpensesFetchStatus={fetchFixedStatus}
                fixedExpensesFetchError={fetchFixedError}
                budget={budget}
                mainCurrency={mainCurrency}
                secondaryCurrency={secondaryCurrency}
                budgetFetchStatus={budgetFetchStatus}
                budgetFetchError={budgetFetchError}
            />

            <Calendar
                calendarDailyExpenses={calendarDailyExpenses}
                estimatedBudget={estimatedBudget}
                fetchCalendarDailyStatus={fetchCalendarDailyStatus}
                fetchCalendarDailyError={fetchCalendarDailyError}
                mainCurrency={mainCurrency}
                budget={budget}
                budgetFetchStatus={budgetFetchStatus}
                budgetFetchError={budgetFetchError}
                updateDailyStatus={updateDailyStatus}
                updateDailyError={updateDailyError}
            />

            <ExpensesPerDayCard
                estimatedBudget={estimatedBudget}
                dailyExpenses={dailyExpenses}
                fetchDailyStatus={fetchDailyStatus}
                fetchDailyError={fetchDailyError}
                mainCurrency={mainCurrency}
                currenciesFetchStatus={budgetFetchStatus}
                currenciesFetchError={budgetFetchError}
            />
        </div>
    )
}

export default DailyBudget;