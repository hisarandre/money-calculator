import CardCustom from "@/components/CardCustom.tsx";
import {DailyExpense} from "@/models/DailyExpense.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store.ts";
import {dailyExpenseFormSchema} from "@/utils/formSchemas.ts";
import {z} from "zod";
import {useEffect} from "react";
import {toast} from "@/hooks/use-toast.ts";
import ExpenseForm from "@/components/calendar/ExpenseForm.tsx";
import {fetchWeek, setWeekNumber, updateDailyExpense} from "@/store/ExpensesSlice.ts";

interface ExpensesPerDayCardProps {
    dailyExpenses: DailyExpense[];
    fetchDailyStatus: string;
    fetchDailyError?: string | null;
    mainCurrency: string | null;
    currenciesFetchStatus: string;
    currenciesFetchError?: string | null;
}

const ExpensesPerDayCard: React.FC<ExpensesPerDayCardProps> = ({
    dailyExpenses,
    fetchDailyStatus,
    fetchDailyError,
    mainCurrency,
    currenciesFetchStatus,
    currenciesFetchError,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {weekNumber, isPreviousAvailable, isNextAvailable, updateDailyStatus, updateDailyError} = useSelector((state: RootState) => state.expenses);

    const formSchema = dailyExpenseFormSchema;

    useEffect(() => {
        if (updateDailyStatus === "failed") {
            toast({
                description: updateDailyError,
                variant: "destructive",
            });
        }
    }, [updateDailyStatus, updateDailyError]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
        dispatch(updateDailyExpense(data));
    };

    const getPreviousWeek = () => {
        dispatch(setWeekNumber(weekNumber - 1));
        dispatch(fetchWeek());
    }

    const getNextWeek = () => {
        dispatch(setWeekNumber(weekNumber + 1));
        dispatch(fetchWeek());
    }

    return (
        <CardCustom
            title="Week X"
            description="Enter the total amount of expenses of the day"
            previousWeekAction={() => getPreviousWeek()}
            nextWeekAction={() => getNextWeek()}
            isPreviousAvailable={isPreviousAvailable}
            isNextAvailable={isNextAvailable}
        >
            {(fetchDailyStatus === "loading" || currenciesFetchStatus === "loading") && <p>Loading daily expenses...</p>}
            {fetchDailyStatus === "failed" && <p className="text-red-500">{fetchDailyError}</p>}
            {currenciesFetchStatus === "failed" && <p className="text-red-500">{currenciesFetchError}</p>}
            {fetchDailyStatus === "succeeded" && dailyExpenses.length > 0 && currenciesFetchStatus === "succeeded" && mainCurrency && (
                dailyExpenses.map((expense, index) => (
                    <ExpenseForm
                        key={index}
                        expense={expense}
                        formSchema={formSchema}
                        mainCurrency={mainCurrency}
                        weekNumber={weekNumber}
                        onSubmit={onSubmit}
                    />
                ))

            )}
        </CardCustom>
    )
}

export default ExpensesPerDayCard;