class AgencyNumberValidator {
  public errors: string;

  public agency: string;

  private regexOnlyNumbers = /^[0-9]+$/;

  public constructor(agency: string) {
    this.errors = '';
    this.agency = this.validate(agency);
  }

  private validate(agency: string): string {
    if (!agency) {
      this.errors += 'agency:A agência não pode ser vazia.|';
      return '';
    }

    if (agency.length < 4) {
      this.errors += 'agency:A agência deve conter no mínimo 4 caracteres.|';
      return '';
    }

    if (agency.length > 4) {
      this.errors += 'agency:A agência deve conter no máximo 4 caracteres.|';
      return '';
    }

    if (!Number(agency)) {
      this.errors += 'agency:A agência deve ser um número.|';
      return '';
    }

    if (!this.regexOnlyNumbers.test(agency)) {
      this.errors += 'agency:A agência só pode conter números.|';
      return '';
    }

    return agency.trim();
  }
}

export { AgencyNumberValidator };
