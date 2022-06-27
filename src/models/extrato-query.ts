interface RequisitiontBankStatement {
  query: {
    agencyNumber: string;
    accountNumber: string;
    agencyVerificationCode: string;
    accountVerificationCode: string;
    document: string;
  };
}

export { RequisitiontBankStatement };
