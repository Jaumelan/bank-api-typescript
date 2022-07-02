import { v4 } from 'uuid';
import {
  APIResponse, UserComplete, Account, AccountCreated,
} from '../models';
import { AccountTable } from '../clients/dao/postgres/account';
import { CheckAccountsTable } from '../clients/dao/postgres/check-accounts';
import { AgencyAccountWriter, VerifyDigitCreator, ExceptionTreatment, EncryptPassword } from '../utils';

class CreateAccountService {
  private AgencyAccountWriter = AgencyAccountWriter;

  private VerifyDigitCreator = VerifyDigitCreator;

  private EncryptPassword = EncryptPassword;

  private AccountExist = CheckAccountsTable;

  public async execute(userData: UserComplete): Promise<APIResponse> {
    try {
        
      const agencyString = new this.AgencyAccountWriter(4);
      const accountString = new this.AgencyAccountWriter(6);
      const verifyDigitAgencyString = new this.VerifyDigitCreator(agencyString.agencyAccount);
      const verifyDigitAccountString = new this.VerifyDigitCreator(accountString.agencyAccount);
      const hashedPassword = new this.EncryptPassword(userData.password);

      const account: Account = {
        id: v4(),
        password: hashedPassword.password,
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
       
        const data : AccountCreated = {
          agency: account.agency,
          agencyVerifyDigit: account.verifyDigitAgency,
          account: account.account,
          accountVerifyDigit: account.verifyDigitAccount,
          owner: userData.name,
          document: userData.cpf,
          birthdate: userData.birthdate,
        }

        return {
          data,
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
