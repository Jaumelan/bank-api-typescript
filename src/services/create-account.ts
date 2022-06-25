import { v4 } from 'uuid';
import {
  APIResponse, User, UserComplete,
} from '../models';
import { UserDataValidator } from '../validators';

class CreateAccountService {
  private UserDataValidator = UserDataValidator;

  public async execute(userData: User): Promise<APIResponse> {
    const userDataValidated = new this.UserDataValidator(userData);

    if (userDataValidated.errors) {
      throw new Error(`400: ${userDataValidated.errors}`);
    }

    const user: UserComplete = {
      id: v4(),
      ...userDataValidated.user,
    };

    return {
      status: 200,
      data: user,
      message: [`Usuário ${user.name} criado com sucesso!`],
    } as APIResponse;
  }
}

export { CreateAccountService };
