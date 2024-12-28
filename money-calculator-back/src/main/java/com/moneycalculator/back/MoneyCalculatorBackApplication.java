package com.moneycalculator.back;

import com.moneycalculator.back.services.BudgetServiceImpl;
import com.moneycalculator.back.services.CurrencyConversionService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class MoneyCalculatorBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoneyCalculatorBackApplication.class, args);
	}

	@Bean
	public CommandLineRunner run(ApplicationContext context) {
		return args -> {
			CurrencyConversionService currencyConversionService = context.getBean(CurrencyConversionService.class);
			currencyConversionService.initialize();
		};
	}
}