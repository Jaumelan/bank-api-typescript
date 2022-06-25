class TransferAmountValidtor {
  public errors: string;

  public amount: number;

  public constructor(amount: number) {
    this.errors = '';
    this.amount = this.validate(amount);
  }

  private validate(amount: number): number {
    if (!amount) {
      this.errors += 'amount:O valor não pode ser vazio.|';
      return 0;
    }

    if (amount < 0) {
      this.errors += 'amount:O valor deve ser maior que zero.|';
      return 0;
    }

    return amount;
  }
}

export { TransferAmountValidtor };
