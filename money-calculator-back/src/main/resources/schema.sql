CREATE DATABASE IF NOT EXISTS money_calculator;
USE money_calculator;

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts (
   _id INT NOT NULL AUTO_INCREMENT,
   label VARCHAR(50) NOT NULL,
   fee DECIMAL(5, 2) NOT NULL,
   isDelete TINYINT(1) DEFAULT 0,
   PRIMARY KEY (_id)
);

CREATE TABLE transactions (
      _id INT NOT NULL AUTO_INCREMENT,
      label VARCHAR(50) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      type ENUM('expense', 'income') NOT NULL,
      isDelete TINYINT(1) DEFAULT 0,
      account_id INT,
      PRIMARY KEY (_id),
      FOREIGN KEY (account_id) REFERENCES accounts(_id)
   );