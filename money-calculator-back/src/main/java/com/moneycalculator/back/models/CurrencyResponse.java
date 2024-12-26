package com.moneycalculator.back.models;

import java.util.List;

public class CurrencyResponse {
    private boolean success;
    private List<Currency> currencies;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public List<Currency> getCurrencies() {
        return currencies;
    }

    public void setCurrencies(List<Currency> currencies) {
        this.currencies = currencies;
    }
}
