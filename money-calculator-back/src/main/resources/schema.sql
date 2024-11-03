CREATE DATABASE IF NOT EXISTS money_calculator;
USE money_calculator;

DROP TABLE IF EXISTS account;

CREATE TABLE account (
   id INT NOT NULL AUTO_INCREMENT,
   label VARCHAR(50) NOT NULL,
   fee DECIMAL(5, 2) NOT NULL,
   PRIMARY KEY (id)
);