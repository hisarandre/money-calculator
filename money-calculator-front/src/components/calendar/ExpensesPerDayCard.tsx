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
import {formatAmount, getWeekDates} from "@/utils/utils.ts";
import {Separator} from "@/components/ui/separator.tsx";

interface ExpensesPerDayCardProps {
    estimatedBudget: number;
    dailyExpenses: DailyExpense[];
    fetchDailyStatus: string;
    fetchDailyError?: string | null;
    mainCurrency: string | null;
    currenciesFetchStatus: string;
    currenciesFetchError?: string | null;
}

const ExpensesPerDayCard: React.FC<ExpensesPerDayCardProps> = ({
    estimatedBudget,
    dailyExpenses,
    fetchDailyStatus,
    fetchDailyError,
    mainCurrency,
    currenciesFetchStatus,
    currenciesFetchError,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        weekNumber,
        total,
        totalSaving,
        isPreviousAvailable,
        isNextAvailable,
        updateDailyStatus,
        updateDailyError
    } = useSelector((state: RootState) => state.expenses);

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

    let monday = "N/A";
    let sunday = "N/A";

    if (dailyExpenses.length > 0) {
        const weekDates = getWeekDates(dailyExpenses[0].date);
        monday = weekDates.monday || "N/A";
        sunday = weekDates.sunday || "N/A";
    }

    return (
        <CardCustom
            title={`Week: ${monday} - ${sunday}`}
            description="Enter the total amount of expenses of the day"
            previousWeekAction={() => getPreviousWeek()}
            nextWeekAction={() => getNextWeek()}
            isPreviousAvailable={isPreviousAvailable}
            isNextAvailable={isNextAvailable}
        >
            {currenciesFetchStatus === "failed" && currenciesFetchError && <p>No budget found. <span className="text-muted-foreground italic">(Error: {currenciesFetchError})</span></p>}

            {currenciesFetchStatus !== "failed" && (
                <>
                    {(fetchDailyStatus === "loading" || currenciesFetchStatus === "loading") && (
                        <p>Loading daily expenses...</p>
                    )}

                    {fetchDailyStatus === "failed" && (
                        <p className="text-red-500">{fetchDailyError}</p>
                    )}

                    {fetchDailyStatus === "succeeded" && dailyExpenses.length > 0 && currenciesFetchStatus === "succeeded" && mainCurrency && (
                        <>
                            <div className="mb-2 flex justify-between gap-4 *:flex-1">
                                <div className="border-border border p-3 mb-2 rounded-md">
                                    <span className="text-sm">Total expenses</span><br />
                                    <strong className="text-lg">{formatAmount(mainCurrency, total)}</strong>
                                </div>

                                <div className="border-border border p-3 mb-2 rounded-md">
                                    <span className="text-sm">Total saving</span><br />
                                    <strong className="text-lg">{formatAmount(mainCurrency, totalSaving)}</strong>
                                </div>
                            </div>

                            <Separator className="mb-4" />

                            {dailyExpenses.map((expense, index) => (
                                <ExpenseForm
                                    key={index}
                                    expense={expense}
                                    estimatedBudget={estimatedBudget}
                                    formSchema={formSchema}
                                    mainCurrency={mainCurrency}
                                    weekNumber={weekNumber}
                                    onSubmit={onSubmit}
                                />
                            ))}
                        </>
                    )}
                </>
            )}
        </CardCustom>
    )
}

export default ExpensesPerDayCard;