interface TransactionRequisition {
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
  amount: string;
}

export { TransactionRequisition };
