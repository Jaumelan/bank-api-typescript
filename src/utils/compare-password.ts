import { EncryptPassword } from "./encrypt-password";

class ComparePassword extends EncryptPassword {
  public compareIt(password: string): boolean {
    if (this.password === password) {
      return true;
    } else {
      return false;
    }
  }
}

export { ComparePassword };
