import { v4 } from 'uuid';
import { APIResponse, User, UserComplete } from '../models';
import { ExceptionTreatment } from '../utils';
import { UserDataValidator } from '../validators';
import { UsersTable } from '../clients/dao/postgres/users';

class CreateUserService {
  private UserDataValidator = UserDataValidator;

  private UsersTable = UsersTable;

  public async execute(userData: User): Promise<APIResponse> {
    try {
      const userDataValidated = new this.UserDataValidator(userData);

      if (userDataValidated.errors) {
        throw new Error(`400: ${userDataValidated.errors}`);
      }

      const userValidated : UserComplete = {
        id: v4(),
        ...userDataValidated.user,
      };

      const insertedUser = await new this.UsersTable()
        .insert(userValidated);

      if (insertedUser) {
        // deve retornar o usuário criado?
        return {
          data: userValidated,
          messages: [],
        } as APIResponse;
      }

      return {
        data: {},
        messages: ['an error occurred while creating user'],
      } as APIResponse;
    } catch (error) {
      throw new ExceptionTreatment(
                error as Error,
                500,
                'an error occurred while inserting user on database',
      );
    }
  }
}

export { CreateUserService };