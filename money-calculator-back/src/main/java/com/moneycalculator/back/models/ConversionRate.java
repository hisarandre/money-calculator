package com.moneycalculator.back.models;

import java.math.BigDecimal;
import java.util.Map;

public class ConversionRate {
    private Map<String, BigDecimal> rates;

    public Map<String, BigDecimal> getRates() {
        return rates;
    }

    public BigDecimal getRate(String currencyCode) {
        return rates != null ? rates.get(currencyCode) : null;
    }
}