interface DepositValidated {
    account: {
        agencyNumber: string;
        agencyVerificationCode: string;
        accountNumber: string;
        accountVerificationCode: string;
        document: string;
    },
    value: number;
}

export { DepositValidated };