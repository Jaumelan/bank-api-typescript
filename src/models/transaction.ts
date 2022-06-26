interface Transaction {
    originAccount: {
        agency: string;
        verifyDigitAgency: string;
        account: string;
        verifyDigitAccount: string;
        document: string;
        password: string;
    }
    destinationAccount: {
        agency: string;
        verifyDigitAgency: string;
        account: string;
        verifyDigitAccount: string;
        document: string;
    }
    amount: number;
    transactionType: string;
}

export { Transaction };
