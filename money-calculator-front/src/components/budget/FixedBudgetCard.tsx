import CardCustom from "@/components/CardCustom.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store.ts";
import {useEffect, useState} from "react";
import {fetchBudget} from "@/store/BudgetSlice.ts";
import {toast} from "@/hooks/use-toast.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {formatAmount, formatFullDateCompact} from "@/utils/utils.ts";
import EditBudget from "@/components/budget/modals/EditBudget.tsx";

const FixedBudgetCard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {budget, fetchStatus, fetchError} = useSelector((state: RootState) => state.budget);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        if (fetchStatus === "idle") {
            dispatch(fetchBudget());
        }
    }, [fetchStatus, dispatch]);

    useEffect(() => {
        if (fetchStatus === "failed") {
            toast({title: "An error occurred", description: fetchError, variant: "destructive"});
        }
    }, [fetchStatus, fetchError]);

    return (
        <CardCustom title={fetchStatus === "succeeded" && budget ? budget.label : "Fixed Budget"} description="" editAction={() => setIsEditDialogOpen(true)}>
            {fetchStatus === "succeeded" && budget && (
                <>
                    <div className="border-border border p-3 mb-2 rounded-md">
                        <strong className="text-muted-foreground font-medium uppercase text-sm">Period</strong><br />
                        <span className="text-lg">Du {formatFullDateCompact(budget.startDate)} au {formatFullDateCompact(budget.endDate)}</span>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Currency</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">{budget.mainCurrency}</TableCell>
                                <TableCell>{formatAmount(budget.mainCurrency, budget.mainCurrencyAmount)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">{budget.secondaryCurrency}</TableCell>
                                <TableCell>{formatAmount(budget.secondaryCurrency, budget.secondaryCurrencyAmount)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <div className="mt-2">
                        <strong>Currency rate ({budget.mainCurrency} to {budget.secondaryCurrency}):</strong> {budget.currencyRate}
                    </div>

                    <EditBudget budget={budget} isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}/>
                </>
            )}
            {fetchStatus === "loading" && <p>Loading budget...</p>}
        </CardCustom>
    )
}

export default FixedBudgetCard;