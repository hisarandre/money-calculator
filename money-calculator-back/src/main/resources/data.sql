INSERT INTO accounts (label, fee) VALUES ('Wise', 2.20);
INSERT INTO accounts (label, fee) VALUES ('Revolut', 2.5);
INSERT INTO accounts (label, fee) VALUES ('Bank - saving', 2.2);
INSERT INTO accounts (label, fee) VALUES ('Bank', 0);

INSERT INTO transactions (label, amount, type, account_id) VALUES ('phone', 20, 'expense', 4);
INSERT INTO transactions (label, amount, type, account_id) VALUES ('salary', 1815, 'income', 4);


INSERT INTO account_balance_histories (sent, total, earning)
VALUES
    ('2024-10-01', 1000.00, 100.00),
    ('2024-10-15', 1100.00, 120.00),
    ('2023-10-01', 1200.00, 130.00);


INSERT INTO account_balances (account_id, account_balance_history_id, amount)
VALUES
    (1, 1, 1000.00),  -- Account 1, linked to history entry 1
    (1, 2, 1050.00),  -- Account 1, linked to history entry 2
    (2, 2, 1100.00),  -- Account 2, linked to history entry 2
    (2, 3, 1150.00);  -- Account 2, linked to history entry 3
