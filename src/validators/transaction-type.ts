class TransactionTypeValidator {
  public errors: string;

  public transactionType: string;

  public constructor(transactionType: string) {
    this.errors = '';
    this.transactionType = this.validate(transactionType);
  }

  private validate(transactionType: string): string {
    const transactionTypes = ['withdrawal', 'deposit', 'transfer'];

    if (!transactionType) {
      this.errors += 'transactionType:O tipo de transação não pode ser vazio.|';
      return '';
    }

    if (!transactionTypes.includes(transactionType)) {
      this.errors += 'transactionType:O tipo de transação deve ser um dos seguintes: withdrawal, deposit ou transfer.|';
      return '';
    }

    return transactionType.trim();
  }
}

export { TransactionTypeValidator };
