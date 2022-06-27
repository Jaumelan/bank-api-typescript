import { v4 } from "uuid";
import {
  APIResponse,
  DepositValidated,
  WithdrawalResponse,
  DepositRequisition,
  TransactionDB,
  AccountUpdate,
} from "../models";
import { ExceptionTreatment, DateWriter } from "../utils";
import { DepositValidator } from "../validators";
import { TransactionsTable } from "../clients/dao/postgres/transactions";
import { UpdateAccountTable } from "../clients/dao/postgres/update-accounts";
import { DepositUsersTable } from "../clients/dao/postgres/deposit-users";
import { WithdrawalAccountTable } from "../clients/dao/postgres/withdrawal-account";

class CreateDepositService {
  private DepositValidator = DepositValidator;

  private UsersTableData = DepositUsersTable;

  private AccountsTableData = WithdrawalAccountTable;

  private TransferTable = TransactionsTable;

  private UpdateAccountTable = UpdateAccountTable;

  private DateWriter = DateWriter;

  public async execute(request: DepositRequisition): Promise<APIResponse> {
    try {
      const DataValidated = new this.DepositValidator(request);

      if (DataValidated.errors) {
        throw new Error(`400: ${DataValidated.errors}`);
      }

      const { depositReq } = DataValidated;
      //console.log('depositReq ', depositReq);
      const user = await new this.UsersTableData().getUserData(depositReq);
      //console.log('user ', user);
      if (user.id !== "") {
        const account = await new this.AccountsTableData().getAccountsData(
          user
        );
        //console.log('account ', account);
        if (depositReq.account.accountNumber !== account.account_number) {
          return {
            data: {},
            messages: ["Account not found"],
          } as APIResponse;
        }

        if (depositReq.account.agencyNumber !== account.agency_number) {
          return {
            data: {},
            messages: ["Agency not found"],
          } as APIResponse;
        }

        if (
          depositReq.account.agencyVerificationCode !==
          account.agency_verification_code
        ) {
          return {
            data: {},
            messages: ["Agency verification code not found"],
          } as APIResponse;
        }

        if (
          depositReq.account.accountVerificationCode !==
          account.account_verification_code
        ) {
          return {
            data: {},
            messages: ["Account verification code not found"],
          } as APIResponse;
        }

        if (account.balance === 0.0) {
          return {
            data: {},
            messages: ["Account balance is zero"],
          } as APIResponse;
        }

        if (account.balance < 0.1 * depositReq.value) {
          return {
            data: {},
            messages: ["Insufficient balance for this transaction"],
          } as APIResponse;
        }

        const date = new this.DateWriter(new Date());
        const taxID = v4();
        const transacID = v4();

        const depositTax: TransactionDB = {
          id: taxID,
          destinationAccountID: "bank",
          originAccountID: account.id,
          value: 0.1 * depositReq.value,
          date: date.date,
          type: "deposit tax",
        };

        const deposit: TransactionDB = {
          id: transacID,
          destinationAccountID: account.id,
          originAccountID: account.id,
          value: depositReq.value,
          date: date.date,
          type: "deposit",
        };

        const updateAccountData: AccountUpdate = {
          accountId: account.id,
          value: account.balance - 0.1 * depositReq.value + depositReq.value,
        };

        const response: WithdrawalResponse = {
          transactionID: transacID,
          type: "deposit",
          value: depositReq.value,
          date: date.date,
          account: {
            accountNumber: account.account_number,
            agencyVerificationCode: account.agency_verification_code,
            agencyNumber: account.agency_number,
            accountVerificationCode: account.account_verification_code,
            owner: user.name,
            document: user.document,
          },
        };

        const depositTaxTransaction = await new this.TransferTable().insert(
          depositTax
        );

        const depositTransaction = await new this.TransferTable().insert(
          deposit
        );

        const updateAccount = await new this.UpdateAccountTable().update(
          updateAccountData
        );

        if (depositTaxTransaction && depositTransaction && updateAccount) {
          return {
            data: response,
            messages: ["Deposit successful"],
          } as APIResponse;
        }

        return {
          data: {},
          messages: ["An error occurred while creating deposit"],
        } as APIResponse;
      }
      return {
        data: {},
        messages: ["User document not found"],
      } as APIResponse;
    } catch (error) {
      throw new ExceptionTreatment(
        error as Error,
        503,
        "service temporarily unavailable"
      );
    }
  }
}

export { CreateDepositService };
