import CardCustom from "@/components/CardCustom.tsx";
import {FixedExpense} from "@/models/FixedExpense.ts";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {formatAmount, formatFrequency} from "@/utils/utils.ts";
import {useState} from "react";
import AddFixedExpense from "@/components/wallet/modals/AddFixedExpense.tsx";
import EditFixedExpense from "@/components/wallet/modals/EditFixedExpense.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Edit, MoreHorizontal, Trash} from "lucide-react";
import DeleteFixedExpense from "@/components/wallet/modals/DeleteFixedExpense.tsx";

interface FixedExpensesCardProps {
    fixedExpenses: FixedExpense[];
    mainCurrencyTotalExpenses: number;
    secondaryCurrencyTotalExpenses: number;
    fixedExpensesFetchStatus: string;
    fixedExpensesFetchError?: string | null;
    mainCurrency: string | null;
    secondaryCurrency?: string | null;
    budgetFetchStatus: string;
    budgetFetchError?: string | null;
}

const FixedExpensesCard: React.FC<FixedExpensesCardProps> = ({
    fixedExpenses,
    mainCurrencyTotalExpenses,
    secondaryCurrencyTotalExpenses,
    fixedExpensesFetchStatus,
    fixedExpensesFetchError,
    mainCurrency,
    secondaryCurrency,
    budgetFetchStatus,
    budgetFetchError
}) => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [fixedExpense, setFixedExpense] = useState<FixedExpense>({id: 0, label: "", mainCurrencyAmount: 0, secondaryCurrencyAmount: 0, frequency: 1});
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [fixedExpenseId, setFixedExpenseId] = useState<number>(0);

    const onEdit = (fixedExpense: FixedExpense) => {
        setFixedExpense(fixedExpense);
        setIsEditDialogOpen(true);
    }

    const onDelete = (id: number) => {
        setFixedExpenseId(id);
        setIsDeleteDialogOpen(true);
    };

    return (
        <CardCustom
            title="Fixed Expenses"
            description="Monthly fixed expenses"
            addAction={budgetFetchStatus !== "failed" ? () => setIsAddDialogOpen(true) : undefined}
        >
            {budgetFetchStatus === "failed" && budgetFetchError && <p>No budget found. <span className="text-muted-foreground italic">(Error: {budgetFetchError})</span></p>}

            {budgetFetchStatus !== "failed" && (
                <>
                    {(fixedExpensesFetchStatus === "loading" || budgetFetchStatus === "loading") && (
                        <p>Loading fixed expenses...</p>
                    )}

                    {fixedExpensesFetchStatus === "failed" && fixedExpensesFetchError && (
                        <p className="text-red-500">{fixedExpensesFetchError}</p>
                    )}

                    {fixedExpensesFetchStatus === "succeeded" &&
                        fixedExpenses.length > 0 &&
                        mainCurrency &&
                        secondaryCurrency &&
                        budgetFetchStatus === "succeeded" && (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Label</TableHead>
                                            <TableHead>{mainCurrency}</TableHead>
                                            {secondaryCurrency && <TableHead>{secondaryCurrency}</TableHead>}
                                            <TableHead>Frequency</TableHead>
                                            <TableHead />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fixedExpenses.map((fe) => (
                                            <TableRow key={fe.id}>
                                                <TableCell className="font-medium">{fe.label}</TableCell>
                                                <TableCell>
                                                    {formatAmount(mainCurrency, fe.mainCurrencyAmount)}
                                                </TableCell>
                                                {secondaryCurrency && (
                                                    <TableCell className="text-muted-foreground">
                                                        {formatAmount(secondaryCurrency, fe.secondaryCurrencyAmount)}
                                                    </TableCell>
                                                )}
                                                <TableCell>{formatFrequency(fe.frequency)}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>
                                                                Actions
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() => onEdit(fe)}
                                                            >
                                                                <Edit className="h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground"
                                                                onClick={() => onDelete(fe.id)}
                                                            >
                                                                <Trash className="h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell>Total on period</TableCell>
                                            <TableCell>
                                                {formatAmount(mainCurrency, mainCurrencyTotalExpenses)}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatAmount(secondaryCurrency, secondaryCurrencyTotalExpenses)}
                                            </TableCell>
                                            <TableCell/>
                                            <TableCell/>
                                        </TableRow>
                                    </TableFooter>
                                </Table>

                                <EditFixedExpense
                                    fixedExpense={fixedExpense}
                                    isOpen={isEditDialogOpen}
                                    onOpenChange={setIsEditDialogOpen}
                                />
                                <DeleteFixedExpense
                                    fixedExpenseId={fixedExpenseId}
                                    isOpen={isDeleteDialogOpen}
                                    onOpenChange={setIsDeleteDialogOpen}
                                />
                            </>
                        )}
                    {fixedExpensesFetchStatus === "succeeded" && fixedExpenses.length === 0 && (
                        <p>No fixed expenses found.</p>
                    )}

                    <AddFixedExpense
                        isOpen={isAddDialogOpen}
                        onOpenChange={setIsAddDialogOpen}
                    />
                </>
            )}
        </CardCustom>
    );
}

export default FixedExpensesCard;