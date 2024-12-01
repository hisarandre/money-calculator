// Currency
import {format} from "date-fns";

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