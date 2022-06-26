import { APIResponse, RequestBankStatement } from '../models';
import { ExceptionTreatment } from '../utils';
import { BankStatementDataValidator } from '../validators';
import { BankStatementUsersTable } from '../clients/dao/postgres/bank-statements-users';
import { BankStatementAccountsTable } from '../clients/dao/postgres/bank-statements-accounts';

class GetExtractService {
  private BankStatementValidator = BankStatementDataValidator;

  private UsersTableData = BankStatementUsersTable;

  private AccountsTableData = BankStatementAccountsTable;

  public async execute(request: RequestBankStatement): Promise<APIResponse> {
    try {
      const DataValidated = new this.BankStatementValidator(request);

      if (DataValidated.errors) {
        throw new Error(`400: ${DataValidated.errors}`);
      }

      const bankStatementReq = DataValidated.bankStatement;

      const bankStatement = await new this.UsersTableData()
        .getUserData(bankStatementReq);

      if (bankStatement.id !== '') {
        const account = await new this.AccountsTableData().getAccountsData(bankStatement);

        if (bankStatementReq.accountNumber !== account.account) {
          return {
            data: {},
            messages: ['Account not found'],
          } as APIResponse;
        }

        if (bankStatementReq.agencyNumber !== account.agency) {
          return {
            data: {},
            messages: ['Agency not found'],
          } as APIResponse;
        }

        if (bankStatementReq.agencyVerificationCode !== account.verifyDigitAgency) {
          return {
            data: {},
            messages: ['Agency verify digit not found'],
          } as APIResponse;
        }

        if (bankStatementReq.accountVerificationCode !== account.verifyDigitAccount) {
          return {
            data: {},
            messages: ['Account verify digit not found'],
          } as APIResponse;
        }

        const extract = {
          agencyNumber: account.agency,
          agencyVerificationCode: account.verifyDigitAgency,
          accountNumber: account.account,
          accountVerificationCode: account.verifyDigitAccount,
          balance: account.balance,
          document: bankStatement.cpf,
          name: bankStatement.name,
        };

        return {
          data: extract,
          messages: [],
        } as APIResponse;
      }

      return {
        data: {},
        messages: ['Document not found'],
      } as APIResponse;
    } catch (error) {
      throw new ExceptionTreatment(
      error as Error,
      500,
      'an error occurred while getting bank statement on database',
      );
    }
  }
}

export { GetExtractService };
