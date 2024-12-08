export interface FixedExpense {
    id: number;
    label: string;
    mainCurrencyAmount: number;
    secondaryCurrencyAmount: number;
    frequency: number;
}