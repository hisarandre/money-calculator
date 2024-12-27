package com.moneycalculator.back.services;

import com.moneycalculator.back.models.*;
import com.moneycalculator.back.repositories.BudgetRepository;
import com.moneycalculator.back.utils.BigDecimalUtils;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import javax.swing.*;
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

    private static List<Currency> currencies = Collections.emptyList();
    private static BigDecimal rate = BigDecimal.ZERO;

    @Autowired
    private BudgetRepository budgetRepository;

    public void initialize() {
        Budget budget = budgetRepository.findFirstByOrderByStartDateAsc();
        this.currencies = loadCurrencies();
        if (budget != null) {
            this.rate = loadConversionRate(budget.getMainCurrency(), budget.getSecondaryCurrency());
        }
    }

    public List<Currency> loadCurrencies() {
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

    public BigDecimal loadConversionRate(String baseCurrency, String secondaryCurrency) {

        String url = apiUrl + "latest?api_key=" + apiKey + "&base=" + baseCurrency + "&symbols=" + secondaryCurrency;

        ConversionRate response = restTemplate.getForObject(url, ConversionRate.class);

        BigDecimal rate = response != null ? response.getRate(secondaryCurrency) : BigDecimal.ZERO;

        return rate;
    }

    public List<Currency> getCurrencies(){
        return currencies;
    }

    public BigDecimal getConversionRate(){
        return rate;
    }
}
