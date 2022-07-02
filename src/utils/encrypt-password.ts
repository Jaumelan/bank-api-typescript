class EncryptPassword {
  public password: string;

  public constructor(password: string) {
    this.password = this.encryptIt(password);
  }

  private encryptIt(password: string): string {
    const crypto = require("crypto");
    const secret = "alphaBank";
    const hash = crypto
      .createHmac("sha256", secret)
      .update(password)
      .digest("hex");

    return hash;
  }
}

export { EncryptPassword };
