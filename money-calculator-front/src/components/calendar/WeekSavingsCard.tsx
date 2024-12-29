import {WeekSaving} from "@/models/WeekSaving.ts";
import CardCustom from "@/components/CardCustom.tsx";
import {format} from "date-fns";
import {formatAmount} from "@/utils/utils.ts";
import {ArrowRight, Banknote, PiggyBank} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface WeekSavingsCardProps {
    weekSavings: WeekSaving[];
    fetchWeekSavingsStatus: string;
    fetchWeekSavingsError?: string | null;
    mainCurrency: string;
    budgetFetchStatus: string;
    budgetFetchError?: string | null;
}

const WeekSavingsCard: React.FC<WeekSavingsCardProps> = ({
    weekSavings,
    fetchWeekSavingsStatus,
    fetchWeekSavingsError,
    mainCurrency,
    budgetFetchStatus,
    budgetFetchError,
}) => {
    let firstMonth = "N/A";
    let lastMonth = "N/A";

    if (weekSavings.length > 0) {
        const firstDate = weekSavings[weekSavings.length - 1].startDate;
        const lastDate = weekSavings[0].endDate;
        firstMonth = format(new Date(firstDate), "MMMM yyyy");
        lastMonth = format(new Date(lastDate), "MMMM yyyy");
    }

    return (
        <CardCustom
            title={`Week Savings: ${firstMonth} - ${lastMonth}`}
            description="The total of savings per week in the last 3 months"
            className="col-span-2"
        >
            {budgetFetchStatus === "failed" && budgetFetchError && <p>No budget found. <span className="text-muted-foreground italic">(Error: {budgetFetchError})</span></p>}

            {budgetFetchStatus !== "failed" && (
                <>
                    {(budgetFetchStatus === "loading" || fetchWeekSavingsStatus === "loading") && (
                        <p>Loading week savings...</p>
                    )}

                    {fetchWeekSavingsStatus === "failed" && (
                        <p className="text-red-500">{fetchWeekSavingsError}</p>
                    )}

                    {fetchWeekSavingsStatus === "succeeded" && weekSavings.length > 0 && budgetFetchStatus === "succeeded" && mainCurrency && (
                        <div className="flex flex-col gap-y-2 divide-border divide-y">
                            {weekSavings.map((weekSaving, index) => (
                                <div key={index} className="grid grid-cols-3 pt-2">
                                    <div className="flex items-center gap-2 font-semibold">
                                        {format(weekSaving.startDate, "dd/MM/yyyy")}
                                        <ArrowRight className="h-4 w-4"/>
                                        {format(weekSaving.endDate, "dd/MM/yyyy")}
                                    </div>

                                    <div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <div className="flex items-center gap-2">
                                                        <div className="rounded border border-border p-2 text-muted-foreground">
                                                            <Banknote size={20} strokeWidth={1.5}/>
                                                        </div>

                                                        {formatAmount(mainCurrency, weekSaving.totalExpense)}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Total Expense</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>

                                    <div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <div className="flex items-center gap-2">
                                                        <div className="rounded border border-border p-2 text-muted-foreground">
                                                            <PiggyBank size={20} strokeWidth={1.5}/>
                                                        </div>

                                                        <span className={`${weekSaving.totalSaving < 0 ? 'font-bold text-destructive' :''}`}>{formatAmount(mainCurrency, weekSaving.totalSaving)}</span>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Total Saving</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {fetchWeekSavingsStatus === "succeeded" && weekSavings.length === 0 && (
                        <p>No week savings found.</p>
                    )}
                </>
            )}
        </CardCustom>
    )
}

export default WeekSavingsCard;