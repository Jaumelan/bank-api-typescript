interface Transaction {
    transactionID: string;
    originAccountID: string;
    destinationAccountID: string;
    date: string;
    value: number;
    type: string;
}

export { Transaction };
