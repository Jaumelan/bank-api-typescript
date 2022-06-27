interface WithdrawalReq {
    account: {
        agencyNumber: string;
        agencyVerificationCode: string;
        accountNumber: string;
        accountVerificationCode: string;
        document: string;
        accountPassword: string;
    },
    value: number;
}
export { WithdrawalReq };
