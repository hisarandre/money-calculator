package com.moneycalculator.back.utils;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class BigDecimalUtils {

    public static Double roundToTwoDecimalPlaces(double value) {
        BigDecimal roundedValue = BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP);
        return roundedValue.doubleValue();
    }
}