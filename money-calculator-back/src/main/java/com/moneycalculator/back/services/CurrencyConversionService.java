package com.moneycalculator.back.services;

import com.moneycalculator.back.models.ConversionAmount;
import com.moneycalculator.back.models.ConversionRate;
import com.moneycalculator.back.models.Currency;
import com.moneycalculator.back.models.CurrencyResponse;
import com.moneycalculator.back.utils.BigDecimalUtils;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CurrencyConversionService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${currencybeacon.api.url}")
    private String apiUrl;

    @Value("${currencybeacon.api.key}")
    private String apiKey;


    public List<Currency> getCurrencies() {
        String url = apiUrl + "currencies?api_key=" + apiKey + "&type=flat";

        // Mapper la réponse JSON dans une structure avec 'response' comme clé
        ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        Map<String, Object> responseBody = responseEntity.getBody();
        if (responseBody != null) {

            List<Map<String, Object>> currenciesRaw = (List<Map<String, Object>>) responseBody.get("response");

            return currenciesRaw.stream()
                    .map(currency -> new Currency(
                            (String) currency.get("name"),
                            (String) currency.get("short_code"),
                            (String) currency.get("symbol")
                    ))
                    .collect(Collectors.toList());
        }

        return Collections.emptyList();
    }

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
