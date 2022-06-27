interface TransferResponse {
    data: {
        transactionID: string;
        type: string;
        value: string;
        date: string;
        originAccount: {
            agencyNumber: string;
            agencyVerificationCode: string;
            accountNumber: string;
            accountVerificationCode: string;
            document: string;
        };
        destinationAccount: {
            agencyNumber: string;
            agencyVerificationCode: string;
            accountNumber: string;
            accountVerificationCode: string;
            document: string;
        };
    };
}

export { TransferResponse };