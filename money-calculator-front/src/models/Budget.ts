export interface Budget {
    id: number;
    label: string;
    startDate: string;
    endDate: string;
    mainCurrencyAmount: number;
    secondaryCurrencyAmount: number;
    conversion: boolean;
    mainCurrency: string;
    secondaryCurrency: string;
    currencyRate: number;
}
