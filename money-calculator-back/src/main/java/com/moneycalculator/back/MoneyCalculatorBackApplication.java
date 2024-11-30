package com.moneycalculator.back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class MoneyCalculatorBackApplication {

	public static void main(String[] args) {
		String activeProfile = System.getenv("SPRING_PROFILES_ACTIVE");

		// Only load from .env if not in 'prod' profile
		if (activeProfile == null || !activeProfile.equals("prod")) {
			Dotenv dotenv = Dotenv.configure().load();

			System.setProperty("DATABASE_URL", dotenv.get("DATABASE_URL"));
			System.setProperty("DATABASE_PWD", dotenv.get("DATABASE_PWD"));
			System.setProperty("DATABASE_USERNAME", dotenv.get("DATABASE_USERNAME"));
		}
		SpringApplication.run(MoneyCalculatorBackApplication.class, args);
	}
}
