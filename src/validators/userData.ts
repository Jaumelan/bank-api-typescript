import {
  UserNameValidator,
  EmailValidator,
  CPFValidator,
  DateValidator,
  PasswordValidator,
} from '.';
import { User } from '../models';

class UserDataValidator {
  public user: User;

  public errors: string;

  private NameValidator = UserNameValidator;

  private EmailValidator = EmailValidator;

  private CpfValidator = CPFValidator;

  private DateValidator = DateValidator;

  private PasswordValidator = PasswordValidator;

  public constructor(user: User) {
    this.errors = '';
    this.user = this.validate(user);
  }

  private validate(user: User): User {
    const {
      name, email, cpf, birthdate, password,
    } = user;

    const nameValidated = new this.NameValidator(name);
    const emailValidated = new this.EmailValidator(email);
    const cpfValidated = new this.CpfValidator(cpf);
    const dateValidated = new this.DateValidator(birthdate);
    const passwordValidated = new this.PasswordValidator(password);

    this.errors = nameValidated.errors
      + emailValidated.errors
      + cpfValidated.errors
      + dateValidated.errors
      + passwordValidated.errors;

    // console.log("userdata ", this.errors);
    const userValidated: User = {
      name: nameValidated.userName,
      email: emailValidated.email,
      cpf: cpfValidated.cpf,
      birthdate: dateValidated.date,
      password: passwordValidated.password,
    };

    return userValidated;
  }
}

export { UserDataValidator };
