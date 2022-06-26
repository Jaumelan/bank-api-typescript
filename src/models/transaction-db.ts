interface TransactionDB {
    id: string;
    date: string;
    value: string;
    originAccountID: string;
    destinationAccountID: string;
    type: string;
}

export { TransactionDB };
