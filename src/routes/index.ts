import express from 'express';
import AccountRoute from './create-account';
import BankStatementRoute from './bank-statement';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(AccountRoute);
app.use(BankStatementRoute);

export default app;
