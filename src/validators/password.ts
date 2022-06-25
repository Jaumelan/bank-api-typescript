class PasswordValidator {
  public errors: string;

  public password: string;

  private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  public constructor(password: string) {
    this.errors = '';
    this.password = this.validate(password);
  }

  private validate(password: string): string {
    if (!password) {
      this.errors += 'password:A senha não pode ser vazia.|';
      return '';
    }

    if (password.length < 8) {
      this.errors += 'password:A senha deve conter no mínimo 8 caracteres.|';
      return '';
    }

    if (password.length > 20) {
      this.errors += 'password:A senha deve conter no máximo 20 caracteres.|';
      return '';
    }

    if (!this.passwordRegex.test(password)) {
      this.errors += 'password:A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.|';
      return '';
    }

    if (!password.trim()) {
      this.errors += 'password:A senha não pode só conter espaços em branco.|';
      return '';
    }

    return password.trim();
  }
}

export { PasswordValidator };
