import { VerifyDigitCreator } from '../utils';

class VerifyDigitAgencyValidator {
  public errors: string;

  public verifyDigitAgency: string;

  private CreateDigit = VerifyDigitCreator;

  public constructor(verifyDigitAgency: string, agency: string) {
    this.errors = '';
    this.verifyDigitAgency = this.validate(verifyDigitAgency, agency);
  }

  private validate(verifyDigitAgency: string, agency: string): string {
    const digit = new this.CreateDigit(agency);

    if (!verifyDigitAgency) {
      this.errors += 'verifyDigitAgency:O dígito verificador da agência não pode ser vazio.|';
      return '';
    }

    if (verifyDigitAgency.length !== 1) {
      this.errors += 'verifyDigitAgency:O dígito verificador da agência deve conter 1 caracter.|';
      return '';
    }

    if (verifyDigitAgency !== digit.verifyDigit) {
      this.errors += 'verifyDigitAgency:O dígito verificador da agência está incorreto.|';
      return '';
    }

    return verifyDigitAgency.trim();
  }
}

export { VerifyDigitAgencyValidator };
