interface TransactionDB {
    id: string;
    date: string;
    value: number;
    originAccountID: string;
    destinationAccountID: string;
    type: string;
}

export { TransactionDB };
