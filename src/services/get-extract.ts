import { APIResponse, RequestBankStatement, BankStatementResponse } from "../models";
import { ExceptionTreatment, TransactionsMovementsWriter } from "../utils";
import { BankStatementDataValidator } from "../validators";
import { TransactionsTable } from "../clients/dao/postgres/get-transactions";
import { BankStatementUsersTable } from "../clients/dao/postgres/bank-statements-users";
import { BankStatementAccountsTable } from "../clients/dao/postgres/bank-statements-accounts";

class GetExtractService {
  private BankStatementValidator = BankStatementDataValidator;

  private UsersTableData = BankStatementUsersTable;

  private AccountsTableData = BankStatementAccountsTable;

  private TransactionsData = TransactionsTable;

  private Movements = TransactionsMovementsWriter;

  public async execute(request: RequestBankStatement): Promise<APIResponse> {
    try {
      const DataValidated = new this.BankStatementValidator(request);

      if (DataValidated.errors) {
        throw new Error(`400: ${DataValidated.errors}`);
      }

      const bankStatementReq = DataValidated.bankStatement;
      // console.log('enviado ', bankStatementReq);
      const bankStatement = await new this.UsersTableData().getUserData(
        bankStatementReq
      );

      //console.log("bankStatement ", bankStatement);

      if (bankStatement.id !== "") {
        const accounts = await new this.AccountsTableData().getAccountsData(
          bankStatement
        );
        // console.log('account ', account);
        const account = accounts.find((account) => {
          return account.account_number === bankStatementReq.accountNumber;
        });
        if (account) {
          if (bankStatementReq.agencyNumber !== account.agency_number) {
            return {
              data: {},
              messages: ["Agency not found"],
            } as APIResponse;
          }

          if (
            bankStatementReq.agencyVerificationCode !==
            account.agency_verification_code
          ) {
            return {
              data: {},
              messages: ["Agency verify digit not found"],
            } as APIResponse;
          }

          if (
            bankStatementReq.accountVerificationCode !==
            account.account_verification_code
          ) {
            return {
              data: {},
              messages: ["Account verify digit not found"],
            } as APIResponse;
          }

          const extractData = await new this.TransactionsData().getTransactionsData(account);

          const movements = new this.Movements().write(extractData);

          console.log(movements)

          const extract : BankStatementResponse = {
            agencyNumber: account.agency_number,
            agencyVerificationCode: account.agency_verification_code,
            accountNumber: account.account_number,
            accountVerificationCode: account.account_verification_code,
            balance: account.balance,
            document: bankStatement.document,
            name: bankStatement.name,
            transactions: movements
          };

          return {
            data: extract,
            messages: [],
          } as APIResponse;
        }
        return {
          data: {},
          messages: ["Account not found"],
        } as APIResponse;
      }

      return {
        data: {},
        messages: ["Document not found"],
      } as APIResponse;
    } catch (error) {
      throw new ExceptionTreatment(
        error as Error,
        500,
        "an error occurred while getting bank statement on database"
      );
    }
  }
}

export { GetExtractService };
