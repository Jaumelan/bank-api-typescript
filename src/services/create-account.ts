import { v4 } from 'uuid';
import {
  APIResponse, UserComplete, Account,
} from '../models';
import { AccountTable } from '../clients/dao/postgres/account';
import { AgencyAccountWriter, VerifyDigitCreator, ExceptionTreatment } from '../utils';

class CreateAccountService {
  private AgencyAccountWriter = AgencyAccountWriter;

  private VerifyDigitCreator = VerifyDigitCreator;

  public async execute(userData: UserComplete): Promise<APIResponse> {
    try {
      const agencyString = new this.AgencyAccountWriter(4);
      const accountString = new this.AgencyAccountWriter(6);
      const verifyDigitAgencyString = new this.VerifyDigitCreator(agencyString.agencyAccount);
      const verifyDigitAccountString = new this.VerifyDigitCreator(accountString.agencyAccount);

      const account: Account = {
        id: v4(),
        userID: userData.id,
        agency: agencyString.agencyAccount,
        verifyDigitAgency: verifyDigitAgencyString.verifyDigit,
        account: accountString.agencyAccount,
        verifyDigitAccount: verifyDigitAccountString.verifyDigit,
        balance: 0,
      };

      // console.log('account ', account);

      const insertedAccount = await new AccountTable()
        .insert(account);

      if (insertedAccount) {
        return {
          data: account,
          messages: [],
        } as APIResponse;
      }

      return {
        data: {},
        messages: ['an error occurred while creating account'],
      } as APIResponse;
    } catch (error) {
      throw new ExceptionTreatment(
     error as Error,
     500,
     'an error occurred while inserting account data on database',
      );
    }
  }
}

export { CreateAccountService };
