class AccountNumberValidator {
  public errors: string;

  public accountNumber: string;

  public constructor(accountNumber: string) {
    this.errors = '';
    this.accountNumber = this.validate(accountNumber);
  }

  private validate(accountNumber: string): string {
    if (!accountNumber) {
      this.errors += 'accountNumber:O número da conta não pode ser vazio.|';
      return '';
    }

    if (accountNumber.length < 10) {
      this.errors += 'accountNumber:O número da conta deve conter no mínimo 10 caracteres.|';
      return '';
    }

    if (accountNumber.length > 10) {
      this.errors += 'accountNumber:O número da conta deve conter no máximo 10 caracteres.|';
      return '';
    }

    return accountNumber.trim();
  }
}

export { AccountNumberValidator };
