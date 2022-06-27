import express from 'express';
import AccountRoute from './create-account';
import BankStatementRoute from './bank-statement';
import WithdrawalRoute from './withdrawal';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(AccountRoute);
app.use(BankStatementRoute);
app.use(WithdrawalRoute);

export default app;
