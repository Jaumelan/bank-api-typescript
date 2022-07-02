import {  BankStatementTransactions, TransactionDB } from "../models";

class TransactionsMovementsWriter {
    public write(data: TransactionDB[]): BankStatementTransactions[] {
        const bankStatementTransactions: BankStatementTransactions[] = [];

        for (const transaction of data) {
            bankStatementTransactions.push({
                id: transaction.id,
                value: transaction.value,
                date: transaction.date,
                description: transaction.type,
            });
        }

        bankStatementTransactions.sort( (a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        return bankStatementTransactions;
    }
}

export { TransactionsMovementsWriter };