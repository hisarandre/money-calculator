import CardCustom from "@/components/CardCustom.tsx";
import {formatAmount} from "@/utils/utils.ts";
import {Progress} from "@/components/ui/progress.tsx";
import {Budget} from "@/models/Budget.ts";

interface CurrentWalletCardProps {
    mainCurrencyCurrentWallet: number;
    secondaryCurrencyCurrentWallet: number;
    estimatedBudget: number;
    fixedExpensesFetchStatus: string;
    fixedExpensesFetchError?: string | null;
    budget: Budget;
    mainCurrency: string | null;
    secondaryCurrency?: string | null;
    budgetFetchStatus: string;
    budgetFetchError?: string | null;
}

const CurrentWalletCard: React.FC<CurrentWalletCardProps> = ({
    mainCurrencyCurrentWallet,
    secondaryCurrencyCurrentWallet,
    estimatedBudget,
    fixedExpensesFetchStatus,
    fixedExpensesFetchError,
    budget,
    mainCurrency,
    secondaryCurrency,
    budgetFetchStatus,
    budgetFetchError
}) => {

    return (
        <CardCustom title="Current Wallet" description="The actual amount of money possessed">
            {budgetFetchStatus === "failed" && budgetFetchError && <p>No budget found. <span className="text-muted-foreground italic">(Error: {budgetFetchError})</span></p>}

            {budgetFetchStatus !== "failed" && budget && (
                <>
                    {(fixedExpensesFetchStatus === "loading" || budgetFetchStatus === "loading") && (
                        <p>Loading fixed expenses...</p>
                    )}

                    {fixedExpensesFetchStatus === "failed" && fixedExpensesFetchError && (
                        <p className="text-red-500">{fixedExpensesFetchError}</p>
                    )}

                    {fixedExpensesFetchStatus === "succeeded" && budgetFetchStatus === "succeeded" && mainCurrency && secondaryCurrency && (
                        <div className="flex flex-col gap-6">
                            <div className="flex items-end justify-between">
                                <p>
                                    <span className="text-xl">{formatAmount(mainCurrency, mainCurrencyCurrentWallet)}</span>
                                    <span className="text-sm"> / {formatAmount(mainCurrency, budget.mainCurrencyAmount)}</span>
                                </p>

                                <p className="text-right text-muted-foreground text-sm">
                                    <strong>{formatAmount(secondaryCurrency, secondaryCurrencyCurrentWallet)}</strong> / {formatAmount(secondaryCurrency, budget.secondaryCurrencyAmount)}
                                </p>
                            </div>

                            <Progress value={mainCurrencyCurrentWallet/budget.mainCurrencyAmount*100}/>

                            <div className="border-border border p-3 mb-2 rounded-md">
                                <strong className="text-muted-foreground font-medium uppercase text-sm">Estimated budget</strong><br />
                                <span className="text-lg">{formatAmount(mainCurrency, estimatedBudget)}</span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </CardCustom>
    )
}

export default CurrentWalletCard;