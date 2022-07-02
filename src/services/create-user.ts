import { v4 } from 'uuid';
import { APIResponse, User, UserComplete } from '../models';
import { ExceptionTreatment, EncryptPassword } from '../utils';
import { UserDataValidator } from '../validators';
import { UsersTable } from '../clients/dao/postgres/users';
import { CheckUsersTable } from '../clients/dao/postgres/check-users';

class CreateUserService {
  private UserDataValidator = UserDataValidator;

  private CheckUsersTable = CheckUsersTable;

  private UsersTable = UsersTable;

  private EncryptPassword = EncryptPassword;

  public async execute(userData: User): Promise<APIResponse> {
    try {
      const userDataValidated = new this.UserDataValidator(userData);

      if (userDataValidated.errors) {
        throw new Error(`400: ${userDataValidated.errors}`);
      }

      const checkUser = await new this.CheckUsersTable().getUserData(userDataValidated.user.cpf);

      if (checkUser.id !== '') {
        
        const data = {
          password: userDataValidated.user.password,
          ...checkUser,
        };
        return {
          data,
          messages: [],
        } as APIResponse;
      }

      //const hashedPassword = new this.EncryptPassword(userDataValidated.user.password);
      //console.log("hashed ", hashedPassword.password.length);
      //const equal = new this.ComparePassword(userDataValidated.user.password).compareIt(userDataValidated.user.password);
      //

      const userValidated : UserComplete = {
        ...userDataValidated.user,
        //password: hashedPassword.password,
        id: v4(),
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
