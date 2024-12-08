import CardCustom from "@/components/CardCustom.tsx";
import {FixedExpense} from "@/models/FixedExpense.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {formatFrequency} from "@/utils/utils.ts";
import {useState} from "react";
import AddFixedExpense from "@/components/wallet/modals/AddFixedExpense.tsx";

interface FixedExpensesCardProps {
    fixedExpenses: FixedExpense[];
    fixedExpensesFetchStatus: string;
    fixedExpensesFetchError?: string | null;
    mainCurrency: string | null;
    secondaryCurrency?: string | null;
    currenciesFetchStatus: string;
    currenciesFetchError?: string | null;
}

const FixedExpensesCard: React.FC<FixedExpensesCardProps> = ({
    fixedExpenses,
    fixedExpensesFetchStatus,
    fixedExpensesFetchError,
    mainCurrency,
    secondaryCurrency,
    currenciesFetchStatus,
    currenciesFetchError
}) => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    return (
        <CardCustom title="Fixed Expenses" description="Monthly fixed expenses" addAction={() => setIsAddDialogOpen(true)}>
            {(fixedExpensesFetchStatus === "loading" || currenciesFetchStatus === 'loading') && <p>Loading fixed expenses...</p>}
            {fixedExpensesFetchStatus === "failed" && fixedExpensesFetchError && <p className="text-red-500">{fixedExpensesFetchError}</p>}
            {currenciesFetchStatus === "failed" && currenciesFetchError && <p className="text-red-500">{currenciesFetchError}</p>}
            {fixedExpensesFetchStatus === "succeeded" && fixedExpenses.length > 0 && currenciesFetchStatus === 'succeeded' && (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Label</TableHead>
                                <TableHead>{mainCurrency}</TableHead>
                                {secondaryCurrency && (
                                    <TableHead>{secondaryCurrency}</TableHead>
                                )}
                                <TableHead className="text-right">Frequency</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fixedExpenses.map((fe) => (
                                <TableRow key={fe.id}>
                                    <TableCell className="font-medium">{fe.label}</TableCell>
                                    <TableCell>{fe.mainCurrencyAmount}</TableCell>
                                    {secondaryCurrency && (
                                        <TableCell>{fe.secondaryCurrencyAmount}</TableCell>
                                    )}
                                    <TableCell className="text-right">{formatFrequency(fe.frequency)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <AddFixedExpense isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}/>
                </>
            )}
            {fixedExpensesFetchStatus === "succeeded" && fixedExpenses.length === 0 && <p>No fixed expenses found.</p>}
        </CardCustom>
    )
}

export default FixedExpensesCard;