INSERT INTO accounts (label, fee) VALUES ('Wise', 2.20);
INSERT INTO accounts (label, fee) VALUES ('Revolut', 2.5);
INSERT INTO accounts (label, fee) VALUES ('Bank - saving', 2.2);
INSERT INTO accounts (label, fee) VALUES ('Bank', 0);

INSERT INTO transactions (label, amount, type, account_id) VALUES ('phone', 20, 'expense', 4);
INSERT INTO transactions (label, amount, type, account_id) VALUES ('salary', 1815, 'income', 4);

INSERT INTO account_balance_histories (sent, total, earning)
VALUES
('2024-11-09', 1000.00, 150.00),
('2024-11-08', 1200.00, 200.00);

INSERT INTO account_balances (amount, account_balance_history_id, account_id)
VALUES
(500.00, 1, 1),
(700.00, 2, 2);