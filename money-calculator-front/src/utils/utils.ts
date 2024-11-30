// Currency
export const formatAmount = (currency: string, amount: number) => {
    if (currency === 'KRW') {
        return `${amount} ₩`;
    } else {
        return `${amount} €`;
    }
};

export const getCurrencySymbol = (currency: string) => {
    if (currency === 'KRW') {
        return '₩';
    } else {
        return '€';
    }
};

// Month and Year
export const formatDate = (date: string | Date, monthFormat: 'short' | 'long') => {
    return new Intl.DateTimeFormat('en', {month: monthFormat, year: 'numeric'}).format(new Date(date));
};

// Day, Month and Year
export const formatFullDate = (date: string | Date, dayFormat: 'numeric' | '2-digit', monthFormat: 'short' | 'long') => {
    return new Intl.DateTimeFormat('en', {day: dayFormat, month: monthFormat, year: 'numeric'}).format(new Date(date));
};

// d/m/Y
export const formatFullDateCompact = (date: string | Date) => {
    return new Intl.DateTimeFormat('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}).format(new Date(date));
};