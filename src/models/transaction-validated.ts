interface TransactionValidated {
  originAccount: {
    agencyNumber: string;
    agencyVerificationCode: string;
    accountNumber: string;
    accountVerificationCode: string;
    document: string;
    password: string;
  };
  destinationAccount: {
    agencyNumber: string;
    agencyVerificationCode: string;
    accountNumber: string;
    accountVerificationCode: string;
    document: string;
  };
  amount: number;
}

export { TransactionValidated };
