import { VerifyDigitCreator } from '../utils';

class VerifyDigitAccountValidator {
  public errors: string;

  public verifyDigitAccount: string;

  private CreateDigit = VerifyDigitCreator;

  public constructor(verifyDigitAccount: string, account: string) {
    this.errors = '';
    this.verifyDigitAccount = this.validate(verifyDigitAccount, account);
  }

  private validate(verifyDigitAccount: string, account: string): string {
    const digit = new this.CreateDigit(account);

    if (!verifyDigitAccount) {
      this.errors += 'verifyDigitAccount:O dígito verificador da conta não pode ser vazio.|';
      return '';
    }

    if (verifyDigitAccount.length !== 1) {
      this.errors += 'verifyDigitAccount:O dígito verificador da conta deve conter 1 caracter.|';
      return '';
    }

    if (verifyDigitAccount !== digit.verifyDigit) {
      this.errors += 'verifyDigitAccount:O dígito verificador da conta está incorreto.|';
      return '';
    }

    return verifyDigitAccount.trim();
  }
}

export { VerifyDigitAccountValidator };
