package com.moneycalculator.back.services;

import com.moneycalculator.back.models.ConversionAmount;
import com.moneycalculator.back.models.ConversionRate;
import com.moneycalculator.back.utils.BigDecimalUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import java.math.BigDecimal;

@Service
public class CurrencyConversionService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${currencybeacon.api.url}")
    private String apiUrl;

    @Value("${currencybeacon.api.key}")
    private String apiKey;

    public Double getConvertedAmount(String fromCurrency, String toCurrency, Double amount) {

        String url = apiUrl + "convert?api_key=" + apiKey + "&from=" + fromCurrency + "&to=" + toCurrency + "&amount=" + amount;

        ConversionAmount response = restTemplate.getForObject(url, ConversionAmount.class);

        BigDecimal rate = response != null ? response.getValue() : BigDecimal.ZERO;

        return BigDecimalUtils.roundToTwoDecimalPlaces(rate.doubleValue());
    }

    public BigDecimal getConversionRate(String baseCurrency, String secondaryCurrency) {

        String url = apiUrl + "latest?api_key=" + apiKey + "&base=" + baseCurrency + "&symbols=" + secondaryCurrency;

        ConversionRate response = restTemplate.getForObject(url, ConversionRate.class);

        BigDecimal rate = response != null ? response.getRate(secondaryCurrency) : BigDecimal.ZERO;

        return rate;
    }
}
