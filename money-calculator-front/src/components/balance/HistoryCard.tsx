import React, {useEffect} from "react";
import CardCustom from "@/components/CardCustom.tsx";
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {Badge} from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store.tsx";
import {toast} from "@/hooks/use-toast.ts";
import {fetchHistory} from "@/store/BalanceSlice.tsx";

const formatDate = (date: string | Date, monthFormat: 'short' | 'long') => {
    return new Intl.DateTimeFormat('en', {month: monthFormat, year: 'numeric'}).format(new Date(date));
};

const chartConfig: ChartConfig = {
    total: {label: "Total per month"},
    earning: {label: "Earning per month"},
};

const HistoryCard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {history, fetchStatus, fetchError} = useSelector((state: RootState) => state.balances);

    useEffect(() => {
        if (fetchStatus === "idle") {
            dispatch(fetchHistory());
        } else if (fetchStatus === "failed") {
            toast({title: "An error occurred", description: fetchError, variant: "destructive"});
        }
    }, [fetchStatus, fetchError, dispatch]);

    if (fetchStatus === "loading") return <p>Loading history data...</p>;

    return (
        <div className="flex w-screen gap-6">
            <CardCustom title="History" description="History per month" className="flex-1">
                {fetchStatus === "succeeded" && (
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <LineChart data={history} margin={{top: 5, right: 10, left: 10, bottom: 0}}>
                            <CartesianGrid/>
                            <YAxis tickLine={false} tickMargin={10} axisLine={false}/>
                            <XAxis
                                dataKey="date"
                                interval="preserveStartEnd"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => formatDate(value, 'short')}
                            />
                            <ChartLegend content={<ChartLegendContent/>}/>
                            <Line type="monotone" dataKey="total" strokeWidth={2} stroke="hsl(var(--chart-1))"
                                  activeDot={{r: 6}}/>
                            <Line type="monotone" dataKey="earning" strokeWidth={2} stroke="hsl(var(--chart-2))"
                                  activeDot={{r: 6}}/>
                            <ChartTooltip content={<ChartTooltipContent label="{date}"
                                                                        labelFormatter={(date) => formatDate(date, 'long')}/>}/>
                        </LineChart>
                    </ChartContainer>
                )}
            </CardCustom>

            <CardCustom title="History Detail" description="Details per month per account">
                {fetchStatus === "succeeded" && (
                    <Accordion type="single" collapsible>
                        {history.slice().reverse().map((hist) => (
                            <AccordionItem key={hist.id} value={`item-${hist.id}`}>
                                <AccordionTrigger>
                                    <div className="w-full flex justify-between items-center gap-10 mr-2">
                                        {formatDate(hist.date, 'long')}
                                        <div className="flex items-center gap-4">
                                            <Badge variant={hist.earning <= 0 ? "destructive" : "positive"}>
                                                {hist.earning > 0 ? `+${hist.earning}` : hist.earning}
                                            </Badge>
                                            {hist.total} €
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Table>
                                        <TableBody>
                                            {hist.accountBalances.map((balance) => (
                                                <TableRow key={balance.id}>
                                                    <TableCell
                                                        className="font-medium">{balance.account.label}</TableCell>
                                                    <TableCell className="text-right">{balance.amount} €</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </CardCustom>
        </div>
    );
};

export default HistoryCard;
