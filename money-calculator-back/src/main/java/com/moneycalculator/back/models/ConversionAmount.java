package com.moneycalculator.back.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class ConversionAmount {
    @JsonProperty("value")
    private BigDecimal value;

    // Getter
    public BigDecimal getValue() {
        return value;
    }

    // Setter
    public void setValue(BigDecimal value) {
        this.value = value;
    }
}
