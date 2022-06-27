import { v4 } from "uuid";
import {
  APIResponse,
  WithdrawalResponse,
  WithdrawalReq,
  TransactionDB,
  AccountUpdate
} from "../models";
import { ExceptionTreatment, DateWriter } from "../utils";
import { WithdrawalReqValidator } from "../validators";
import { WithdrawalUsersTable } from "../clients/dao/postgres/withdrawal-users";
import { WithdrawalAccountTable } from "../clients/dao/postgres/withdrawal-account";
import { TransactionsTable } from "../clients/dao/postgres/transactions";
import { UpdateAccountTable } from "../clients/dao/postgres/update-accounts";

class CreateWithdrawalService {
  private WithdrawalValidator = WithdrawalReqValidator;

  private UsersTableData = WithdrawalUsersTable;

  private AccountsTableData = WithdrawalAccountTable;

  private TransferTable = TransactionsTable;

  private UpdateAccountTable = UpdateAccountTable;

  private DateWriter = DateWriter;

  public async execute(request: WithdrawalReq): Promise<APIResponse> {
    try {
      const DataValidated = new this.WithdrawalValidator(request);

      if (DataValidated.errors) {
        throw new Error(`400: ${DataValidated.errors}`);
      }

      const withdrawalReq = DataValidated.withdrawalReq;
      //console.log('withdrawalReq ', withdrawalReq);
      const user = await new this.UsersTableData().getUserData(withdrawalReq);
      //console.log('user ', user);
      if (user.id !== "") {
        const account = await new this.AccountsTableData().getAccountsData(
          user
        );
          //console.log('account ', account);
        if (withdrawalReq.account.accountNumber !== account.account_number) {
          return {
            data: {},
            messages: ["Account not found"],
          } as APIResponse;
        }

        if (withdrawalReq.account.agencyNumber !== account.agency_number) {
          return {
            data: {},
            messages: ["Agency not found"],
          } as APIResponse;
        }

        if (
          withdrawalReq.account.agencyVerificationCode !==
          account.agency_verification_code
        ) {
          return {
            data: {},
            messages: ["Agency verify digit not found"],
          } as APIResponse;
        }

        if (
          withdrawalReq.account.accountVerificationCode !==
          account.account_verification_code
        ) {
          return {
            data: {},
            messages: ["Account verify digit not found"],
          } as APIResponse;
        }

        if (account.balance === 0.00) {
          return {
            data: {},
            messages: ["Account balance is zero"],
          } as APIResponse;
        }

        if (withdrawalReq.value > account.balance + 4.0) {
          return {
            data: {},
            messages: ["Insufficient balance"],
          } as APIResponse;
        }

        const date = new this.DateWriter(new Date());
        const taxID = v4();
        const transacID = v4();

        const withdrawalTax: TransactionDB = {
          id: taxID,
          destinationAccountID: "bank",
          originAccountID: account.id,
          value: 4,
          date: date.date,
          type: "withdrawal tax",
        };

        const withdrawal: TransactionDB = {
          id: transacID,
          destinationAccountID: "---",
          originAccountID: account.id,
          value: withdrawalReq.value,
          date: date.date,
          type: "withdrawal",
        };

        const updateData: AccountUpdate = {
            accountId: account.id,
            value: account.balance - withdrawalReq.value - 4,
        }

        const response: WithdrawalResponse = {
            data: {
                transactionID: transacID,
                type: "withdrawal",
                value: withdrawalReq.value,
                date: date.date,
                account: {
                    agencyNumber: account.agency_number,
                    agencyVerificationCode: account.agency_verification_code,
                    accountNumber: account.account_number,
                    accountVerificationCode: account.account_verification_code,
                    owner: user.name,
                    document: user.document,
                }
            }
        }
        //console.log('withdrawaltax ', withdrawalTax);
        const withdrawalTaxTransaction = await new this.TransferTable().insert(
          withdrawalTax
        );
          //console.log('transaction ', withdrawalTaxTransaction);
        //console.log('withdrawalTaxTransaction ', withdrawalTaxTransaction);
        const withdrawalTransaction = await new this.TransferTable().insert(
          withdrawal
        );
        //console.log('updateData ', updateData);
        const updateAccount = await new this.UpdateAccountTable().update(updateData);

        //console.log('updateAccount ', updateAccount);
        if (withdrawalTaxTransaction && withdrawalTransaction && updateAccount) {
          return {
            data: response,
            messages: ["Withdrawal created"],
          } as APIResponse;
        }

        return {
          data: {},
          messages: ["An error occurred while Withdrawal"],
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

export { CreateWithdrawalService };
