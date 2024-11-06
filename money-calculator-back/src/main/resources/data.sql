INSERT INTO accounts (label, fee, isDelete) VALUES ('Wise', 2.20, false);
INSERT INTO accounts (label, fee, isDelete) VALUES ('Revolut', 2.5, false);
INSERT INTO accounts (label, fee, isDelete) VALUES ('Bank - saving', 2.2, false);
INSERT INTO accounts (label, fee, isDelete) VALUES ('Bank', 0, false);

INSERT INTO transactions (label, amount, type, account_id, isDelete) VALUES ('phone', 20, 'expense', 4, false);
INSERT INTO transactions (label, amount, type, account_id, isDelete) VALUES ('salary', 1815, 'income', 4, false);