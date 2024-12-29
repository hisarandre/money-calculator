INSERT INTO accounts (label, fee) VALUES ('Wise', 10.0);
INSERT INTO accounts (label, fee) VALUES ('Revolut', 0.0);
INSERT INTO accounts (label, fee) VALUES ('Bank - saving', 0.0);
INSERT INTO accounts (label, fee) VALUES ('Bank', 0);

INSERT INTO transactions (label, amount, type, account_id) VALUES ('phone', 50, 'expense', 2);
INSERT INTO transactions (label, amount, type, account_id) VALUES ('salary', 100, 'income', 2);


INSERT INTO account_balance_histories (sent, total, earning) VALUES ('2024-10-01', 1000.00, 100.00);
INSERT INTO account_balances (account_id, account_balance_history_id, amount) VALUES (1, 1, 500.00), (2, 1, 500.00);


INSERT INTO budgets (label, amount, start_date, end_date, conversion, main_currency, secondary_currency)
VALUES ('Monthly Budget', 1500.00, '2024-11-13', '2024-12-11', 1, 'KRW', 'EUR');

INSERT INTO fixed_expenses (label, amount, frequency)
VALUES ('Internet Subscription', 50.00, 1);

INSERT INTO daily_expenses (date, amount) VALUES ('2024-11-22', 50.00);
INSERT INTO daily_expenses (date, amount) VALUES ('2024-11-23', 50.00);


INSERT INTO users (_id, display_name, email, photoURL)
VALUES ('y3wCMXiuytVEEZ62WUtWRh1GhBn2', 'Sara', 'info.sarahandre@gmail.com', 'https://i.pinimg.com/736x/e0/1c/64/e01c642be639e32708f86b8b5bacb5e3.jpg');
INSERT INTO users (_id, display_name, email, photoURL)
VALUES ('lfQrhpf7ZMfEc3G0kkdy7KQjrMn1', 'Cecilia', 'ngcecilia@orange.fr', 'https://i.pinimg.com/736x/60/98/69/6098690ef77fe450b87b89c3e97c636f.jpg');
