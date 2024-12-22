// Currency
import {format} from "date-fns";

export const formatAmount = (currency: string, amount: number) => {
    const currencyFormatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency,
    });

    return currencyFormatter.format(amount);
};

export const getCurrencySymbol = (currency: string) => {
    if (currency === 'KRW') {
        return '₩';
    } else {
        return '€';
    }
};

// TODO: refactor with format()
// Month and Year
export const formatDate = (date: string | Date, monthFormat: 'short' | 'long') => {
    return new Intl.DateTimeFormat('en', {month: monthFormat, year: 'numeric'}).format(new Date(date));
};

// d/m/Y
export const formatFullDateCompact = (date: string | Date) => {
    return new Intl.DateTimeFormat('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}).format(new Date(date));
};

export const getDayAfter = (date: string): string => {
    const parsedDate = new Date(date);
    parsedDate.setDate(parsedDate.getDate() + 1);
    return format(parsedDate, "yyyy-MM-dd");
};

export const getWeekDates = (dateString: string) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
        monday: format(monday, "d MMM, yyyy"),
        sunday: format(sunday, "d MMM, yyyy"),
    };
}

// Expense frequency
export const formatFrequency = (frequency: number): string => {
    if (frequency === 1) {
        return 'Each month';
    } else {
        return `Every ${frequency} months`;
    }
}