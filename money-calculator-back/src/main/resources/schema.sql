CREATE DATABASE IF NOT EXISTS money_calculator;
USE money_calculator;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS account_balances;
DROP TABLE IF EXISTS account_balance_histories;
DROP TABLE IF EXISTS accounts;

DROP TABLE IF EXISTS daily_expenses;
DROP TABLE IF EXISTS fixed_expenses;
DROP TABLE IF EXISTS budgets;

CREATE TABLE users (
  _id VARCHAR(50) NOT NULL,
  display_name VARCHAR(50),
  email VARCHAR(50) NOT NULL UNIQUE,
  photoURL VARCHAR(200),
  PRIMARY KEY (_id)
);

CREATE TABLE budgets (
   _id INT NOT NULL AUTO_INCREMENT,
   label VARCHAR(50) NOT NULL,
   amount DECIMAL(10, 2) NOT NULL,
   start_date DATE NOT NULL,
   end_date DATE NOT NULL,
   conversion TINYINT(1) NOT NULL,
   main_currency VARCHAR(3) NOT NULL,
   secondary_currency VARCHAR(3),
   PRIMARY KEY (_id)
);

CREATE TABLE fixed_expenses (
    _id INT NOT NULL AUTO_INCREMENT,
    label VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    frequency INT NOT NULL,
    PRIMARY KEY (_id)
);

CREATE TABLE daily_expenses (
    _id INT NOT NULL AUTO_INCREMENT,
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    PRIMARY KEY (_id)
);

CREATE TABLE accounts (
   _id INT NOT NULL AUTO_INCREMENT,
   label VARCHAR(50) NOT NULL,
   fee DECIMAL(5, 2) NOT NULL,
   PRIMARY KEY (_id)
);

CREATE TABLE transactions (
      _id INT NOT NULL AUTO_INCREMENT,
      label VARCHAR(50) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      type ENUM('expense', 'income') NOT NULL,
      account_id INT,
      PRIMARY KEY (_id),
      FOREIGN KEY (account_id) REFERENCES accounts(_id)
);

CREATE TABLE account_balance_histories (
    _id INT NOT NULL AUTO_INCREMENT,
    sent DATE NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    earning DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (_id)
);

CREATE TABLE account_balances (
    _id INT NOT NULL AUTO_INCREMENT,
    account_id INT NOT NULL,
    account_balance_history_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (_id),
    FOREIGN KEY (account_id) REFERENCES accounts(_id),
    FOREIGN KEY (account_balance_history_id) REFERENCES account_balance_histories(_id)
);
