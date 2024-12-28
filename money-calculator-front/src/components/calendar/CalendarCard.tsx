import CardCustom from "@/components/CardCustom.tsx";
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import {CalendarDailyExpense} from "@/models/CalendarDailyExpense.ts";
import {formatAmount} from "@/utils/utils.ts";
import {Budget} from "@/models/Budget.ts";
import {useEffect, useState} from "react";
import EditCalendarDailyExpense from "@/components/calendar/modals/EditCalendarDailyExpense.tsx";
import {toast} from "@/hooks/use-toast.ts";
import {z} from "zod";
import {
    fetchCalendar,
    fetchWeek,
    setWeekNumber as setStoreWeekNumber,
    updateDailyExpense
} from "@/store/ExpensesSlice.ts";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store/Store.ts";
import {dailyExpenseFormSchema} from "@/utils/formSchemas.ts";
import AddCalendarDailyExpense from "@/components/calendar/modals/AddCalendarDailyExpense.tsx";

interface CalendarCardProps {
    calendarDailyExpenses: CalendarDailyExpense[];
    estimatedBudget: number;
    fetchCalendarDailyStatus: string;
    fetchCalendarDailyError?: string | null;
    mainCurrency: string | null;
    budget: Budget;
    budgetFetchStatus: string;
    budgetFetchError?: string | null;
    updateDailyStatus: string;
    updateDailyError?: string | null;
}

const CalendarCard: React.FC<CalendarCardProps> = ({
    calendarDailyExpenses,
    estimatedBudget,
    fetchCalendarDailyStatus,
    fetchCalendarDailyError,
    mainCurrency,
    budget,
    budgetFetchStatus,
    budgetFetchError,
    updateDailyStatus,
    updateDailyError
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [calendarDailyExpense, setCalendarDailyExpense] = useState<CalendarDailyExpense|null>(null);
    const [date, setDate] = useState<string|null>(null);
    const [weekNumber, setWeekNumber] = useState<number>(0);

    let formattedCalendarDailyExpenses = [];
    if (calendarDailyExpenses.length > 0 && mainCurrency && estimatedBudget) {
        formattedCalendarDailyExpenses = calendarDailyExpenses.map((expense) => ({
            ...expense,
            title: formatAmount(mainCurrency, Number(expense.title)),
            backgroundColor: Number(expense.title) <= estimatedBudget ? "hsl(142.4 71.8% 29.2%)" : "hsl(0 62.8% 30.6%)",
        }));
    }

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
        await dispatch(updateDailyExpense(data));
        dispatch(fetchCalendar());
        dispatch(fetchWeek());

        setIsEditDialogOpen(false);
        setCalendarDailyExpense(null);

        setIsAddDialogOpen(false);
        setDate(null);
    };

    // TODO: arrow style + today button
    return (
        <CardCustom title="Calendar" description="Display the expenses per day"
                    className="col-span-2 row-span-2">
            {budgetFetchStatus === "failed" && budgetFetchError && (
                <FullCalendar
                    plugins={[ dayGridPlugin, interactionPlugin ]}
                    initialView="dayGridMonth"
                    firstDay={1}
                />
            )}

            {budgetFetchStatus !== "failed" && budget && (
                <>
                    {fetchCalendarDailyStatus === "loading" && (
                        <p>Loading calendar...</p>
                    )}

                    {fetchCalendarDailyStatus === "failed" && fetchCalendarDailyError && (
                        <p className="text-red-500">{fetchCalendarDailyError}</p>
                    )}

                    {fetchCalendarDailyStatus === "succeeded" && calendarDailyExpenses.length > 0 && (
                        <>
                            <FullCalendar
                                plugins={[ dayGridPlugin, interactionPlugin ]}
                                initialView="dayGridMonth"
                                firstDay={1}
                                validRange={{
                                    start: budget.startDate,
                                    end: new Date(new Date(budget.endDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                                }}
                                events={formattedCalendarDailyExpenses}
                                eventClassNames={["cursor-pointer"]}
                                dayCellClassNames={(arg) => {
                                    if (!arg.isDisabled) {
                                        return ["cursor-pointer"];
                                    }
                                }}
                                eventClick={(info) => {
                                    const id = Number(info.event.id);
                                    const expense = calendarDailyExpenses.find(
                                        (expense) => expense.id === id
                                    );
                                    setCalendarDailyExpense(expense ?? null);
                                    setIsEditDialogOpen(true);
                                }}
                                dateClick={(info) => {
                                    const date = info.dateStr;
                                    const expense = calendarDailyExpenses.find(
                                        (expense) => expense.start === date
                                    );
                                    if (expense === undefined) {
                                        setDate(date);
                                        setIsAddDialogOpen(true);
                                    } else {
                                        setCalendarDailyExpense(expense ?? null);
                                        setIsEditDialogOpen(true);
                                    }
                                }}
                            />

                            {mainCurrency && (
                                <>
                                    {date && (
                                        <AddCalendarDailyExpense
                                            date={date}
                                            mainCurrency={mainCurrency}
                                            estimatedBudget={estimatedBudget}
                                            isOpen={isAddDialogOpen}
                                            onOpenChange={setIsAddDialogOpen}
                                            formSchema={formSchema}
                                            onSubmit={onSubmit}
                                        />
                                    )}

                                    {calendarDailyExpense && (
                                        <EditCalendarDailyExpense
                                            calendarDailyExpense={calendarDailyExpense}
                                            mainCurrency={mainCurrency}
                                            estimatedBudget={estimatedBudget}
                                            isOpen={isEditDialogOpen}
                                            onOpenChange={setIsEditDialogOpen}
                                            formSchema={formSchema}
                                            onSubmit={onSubmit}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {fetchCalendarDailyStatus === "succeeded" && calendarDailyExpenses.length === 0 && (
                        <FullCalendar
                            plugins={[ dayGridPlugin, interactionPlugin ]}
                            initialView="dayGridMonth"
                            firstDay={1}
                        />
                    )}
                </>
            )}
        </CardCustom>
    )
}

export default CalendarCard;