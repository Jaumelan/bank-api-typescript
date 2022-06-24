import {
  UserNameValidator,
  EmailValidator,
  CPFValidator,
  DateValidator,
} from ".";
import { User } from "../models";

class UserDataValidator {
  public user: User;
  public errors: string;

  private nameValidator = UserNameValidator;
  private emailValidator = EmailValidator;
  private cpfValidator = CPFValidator;
  private dateValidator = DateValidator;

  public constructor(user: User) {
    this.errors = "";
    this.user = this.validate(user);
  }

  private validate(user: User): User {
    const { name, email, cpf, birthday } = user;

    const nameValidated = new this.nameValidator(name);
    const emailValidated = new this.emailValidator(email);
    const cpfValidated = new this.cpfValidator(cpf);
    const dateValidated = new this.dateValidator(birthday);

    this.errors =
      nameValidated.errors +
      emailValidated.errors +
      cpfValidated.errors +
      dateValidated.errors;

      //console.log("userdata ", this.errors);
    const userValidated: User = {
      name: nameValidated.userName,
      email: emailValidated.email,
      cpf: cpfValidated.cpf,
      birthday: dateValidated.date,
    };

    return userValidated;
  }
}

export { UserDataValidator };
