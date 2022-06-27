interface DepositRequisition {
    account: {
        agencyNumber: string;
        agencyVerificationCode: string;
        accountNumber: string;
        accountVerificationCode: string;
        document: string;
    },
    value: number;
}

export { DepositRequisition };