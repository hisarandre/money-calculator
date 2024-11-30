package com.moneycalculator.back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class MoneyCalculatorBackApplication {

	public static void main(String[] args) {

		/*Dotenv dotenv = Dotenv.configure().load();

		System.setProperty("DATABASE_URL", dotenv.get("DATABASE_URL"));
		System.setProperty("DATABASE_PWD", dotenv.get("DATABASE_PWD"));
		System.setProperty("DATABASE_USERNAME", dotenv.get("DATABASE_USERNAME"));*/

		SpringApplication.run(MoneyCalculatorBackApplication.class, args);
	}
}
