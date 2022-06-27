import express from 'express';
import AccountRoute from './create-account';
import BankStatementRoute from './bank-statement';
import WithdrawalRoute from './withdrawal';
import DepositRoute from './create-deposit';
import TransferRoute from './transfer';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(AccountRoute);
app.use(BankStatementRoute);
app.use(WithdrawalRoute);
app.use(DepositRoute);
app.use(TransferRoute);

export default app;
