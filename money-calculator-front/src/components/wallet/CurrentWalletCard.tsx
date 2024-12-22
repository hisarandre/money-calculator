import CardCustom from "@/components/CardCustom.tsx";
import {formatAmount} from "@/utils/utils.ts";
import {Progress} from "@/components/ui/progress.tsx";

interface CurrentWalletCardProps {
    mainCurrencyCurrentWallet: number;
    secondaryCurrencyCurrentWallet: number;
    estimatedBudget: number;
    mainCurrencyTotalExpenses: number;
    secondaryCurrencyTotalExpenses: number;
    fixedExpensesFetchStatus: string;
    fixedExpensesFetchError?: string | null;
    mainCurrency: string | null;
    secondaryCurrency?: string | null;
    currenciesFetchStatus: string;
    currenciesFetchError?: string | null;
}

const CurrentWalletCard: React.FC<CurrentWalletCardProps> = ({
    mainCurrencyCurrentWallet,
    secondaryCurrencyCurrentWallet,
    estimatedBudget,
    mainCurrencyTotalExpenses,
    secondaryCurrencyTotalExpenses,
    fixedExpensesFetchStatus,
    fixedExpensesFetchError,
    mainCurrency,
    secondaryCurrency,
    currenciesFetchStatus,
    currenciesFetchError
}) => {

    return (
        <CardCustom title="Current Wallet" description="The actual amount of money possessed">
            {(fixedExpensesFetchStatus === "loading" || currenciesFetchStatus === "loading") && <p>Loading fixed expenses...</p>}
            {fixedExpensesFetchStatus === "failed" && fixedExpensesFetchError && <p className="text-red-500">{fixedExpensesFetchError}</p>}
            {currenciesFetchStatus === "failed" && currenciesFetchError && <p className="text-red-500">{currenciesFetchError}</p>}
            {fixedExpensesFetchStatus === "succeeded" && currenciesFetchStatus === "succeeded" && mainCurrency && secondaryCurrency && (
                <div className="flex flex-col gap-6">
                    <div className="flex items-end justify-between">
                        <p>
                            <span className="text-xl">{formatAmount(mainCurrency, mainCurrencyCurrentWallet)}</span>
                            <span className="text-sm"> / {formatAmount(mainCurrency, mainCurrencyTotalExpenses)}</span>
                        </p>

                        <p className="text-right text-muted-foreground text-sm">
                            <strong>{formatAmount(secondaryCurrency, secondaryCurrencyCurrentWallet)}</strong> / {formatAmount(secondaryCurrency, secondaryCurrencyTotalExpenses)}
                        </p>
                    </div>

                    <Progress value={mainCurrencyCurrentWallet/mainCurrencyTotalExpenses*100}/>

                    <div className="border-border border p-3 mb-2 rounded-md">
                        <strong className="text-muted-foreground font-medium uppercase text-sm">Estimated budget</strong><br />
                        <span className="text-lg">{formatAmount(mainCurrency, estimatedBudget)}</span>
                    </div>
                </div>
            )}
        </CardCustom>
    )
}

export default CurrentWalletCard;