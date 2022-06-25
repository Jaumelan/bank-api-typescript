class VerifyDigitCreator {
  public verifyDigit: string;

  public constructor(verifyDigitlocal: string) {
    this.verifyDigit = this.createDigit(verifyDigitlocal);
  }

  // eslint-disable-next-line class-methods-use-this
  private createDigit(verifyDigitlocal: string): string {
    let sum = 0;
    for (let i = 0; i < verifyDigitlocal.length; i += 1) {
      sum += parseInt(verifyDigitlocal[i], 10);
    }
    return (sum % 10).toString();
  }
}

export { VerifyDigitCreator };
