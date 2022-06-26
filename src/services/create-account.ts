import { v4 } from 'uuid';
import {
  APIResponse, User, UserComplete, Account,
} from '../models';
import { AgencyAccountWriter, VerifyDigitCreator } from '../utils';
import { UserDataValidator } from '../validators';

class CreateAccountService {
  private UserDataValidator = UserDataValidator;

  private AgencyAccountWriter = AgencyAccountWriter;

  private VerifyDigitCreator = VerifyDigitCreator;

  public async execute(userData: User): Promise<APIResponse> {
    const userDataValidated = new this.UserDataValidator(userData);

    if (userDataValidated.errors) {
      throw new Error(`400: ${userDataValidated.errors}`);
    }

    const user: UserComplete = {
      id: v4(),
      ...userDataValidated.user,
    };

    const agencyString = new this.AgencyAccountWriter(4);
    const accountString = new this.AgencyAccountWriter(6);

    const account: Account = {
      id: v4(),
      userID: user.id,
      agency: agencyString.agencyAccount,
      verifyDigitAgency: new this.VerifyDigitCreator(agencyString.agencyAccount),
      account: accountString.agencyAccount,
      verifyDigitAccount: new this.VerifyDigitCreator(accountString.agencyAccount),
      balance: 0,
    };

    return {
      status: 200,
      data: user,
      message: [`Usuário ${user.name} criado com sucesso!`],
    } as APIResponse;
  }
}

export { CreateAccountService };
