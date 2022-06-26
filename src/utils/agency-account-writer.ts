class AgencyAccountWriter {
  public agencyAccount: string;

  public constructor(quantity: number) {
    this.agencyAccount = this.createAgencyAccount(quantity);
  }

  // eslint-disable-next-line class-methods-use-this
  private createAgencyAccount(quantity: number): string {
    const numbers = [];
    for (let i = 0; i < quantity; i += 1) {
      numbers.push(Math.floor(Math.random() * 10));
    }
    return numbers.join('');
  }
}
export { AgencyAccountWriter };
