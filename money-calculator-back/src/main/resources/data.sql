INSERT INTO accounts (label, fee) VALUES ('Wise', 10.0);
INSERT INTO accounts (label, fee) VALUES ('Revolut', 0.0);
INSERT INTO accounts (label, fee) VALUES ('Bank - saving', 0.0);
INSERT INTO accounts (label, fee) VALUES ('Bank', 0);

INSERT INTO transactions (label, amount, type, account_id) VALUES ('phone', 50, 'expense', 2);
INSERT INTO transactions (label, amount, type, account_id) VALUES ('salary', 100, 'income', 2);


INSERT INTO account_balance_histories (sent, total, earning) VALUES ('2024-10-01', 1000.00, 100.00);
INSERT INTO account_balances (account_id, account_balance_history_id, amount) VALUES (1, 1, 500.00), (2, 1, 500.00);
