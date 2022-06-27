interface WithdrawalResponse {
  transactionID: string;
  type: string;
  value: number;
  date: string;
  account: {
    agencyNumber: string;
    agencyVerificationCode: string;
    accountNumber: string;
    accountVerificationCode: string;
    owner: string;
    document: string;
  };
}

export { WithdrawalResponse };
