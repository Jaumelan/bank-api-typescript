import { v4 } from "uuid";
import {
  APIResponse,
  WithdrawalResponse,
  TransactionRequisition,
  TransferResponse,
  TransactionDB,
  AccountUpdate,
} from "../models";
import { ExceptionTreatment, DateWriter } from "../utils";
import { TransferValidator } from "../validators";
import { TransferDestinationUsersTable } from "../clients/dao/postgres/transfer-destination-users";
import { TransferOriginUsersTable } from "../clients/dao/postgres/transfer-origin-users";
import { WithdrawalAccountTable } from "../clients/dao/postgres/withdrawal-account";
import { TransactionsTable } from "../clients/dao/postgres/transactions";
import { UpdateAccountTable } from "../clients/dao/postgres/update-accounts";

class CreateTransferService {
  private TransferValidator = TransferValidator;

  private OriginUsersTableData = TransferOriginUsersTable;

  private DestinationUsersTableData = TransferDestinationUsersTable;

  private AccountsTableData = WithdrawalAccountTable;

  private TransferTable = TransactionsTable;

  private UpdateAccountTable = UpdateAccountTable;

  private DateWriter = DateWriter;

  public async execute(request: TransactionRequisition): Promise<APIResponse> {
    try {
      const DataValidated = new this.TransferValidator(request);

      if (DataValidated.errors) {
        throw new Error(`400: ${DataValidated.errors}`);
      }

      const { transactionReq } = DataValidated;
      //console.log('transactionReq ', transactionReq);
      const originUser = await new this.OriginUsersTableData().getUserData(
        transactionReq
      );
      //  console.log('originUser ', originUser);
      const destUser = await new this.DestinationUsersTableData().getUserData(
        transactionReq
      );
      //console.log('user Dest ', destUser);
      if (originUser.id !== "") {
        const orAccount = await new this.AccountsTableData().getAccountsData(
          originUser
        );
        //console.log('account ', account);
        if (
          transactionReq.originAccount.accountNumber !==
          orAccount.account_number
        ) {
          return {
            data: {},
            messages: ["Origin account not found"],
          } as APIResponse;
        }

        if (
          transactionReq.originAccount.agencyNumber !== orAccount.agency_number
        ) {
          return {
            data: {},
            messages: ["Origin agency not found"],
          } as APIResponse;
        }

        if (
          transactionReq.originAccount.agencyVerificationCode !==
          orAccount.agency_verification_code
        ) {
          return {
            data: {},
            messages: ["Origin agency verify digit not found"],
          } as APIResponse;
        }

        if (
          transactionReq.originAccount.accountVerificationCode !==
          orAccount.account_verification_code
        ) {
          return {
            data: {},
            messages: ["Origin account verify digit not found"],
          } as APIResponse;
        }

        if (orAccount.balance === 0.0) {
          return {
            data: {},
            messages: ["Account balance is zero"],
          } as APIResponse;
        }

        if (transactionReq.amount > orAccount.balance + 1.0) {
          return {
            data: {},
            messages: ["Insufficient balance"],
          } as APIResponse;
        }

        if (destUser.id !== "") {
          const account = await new this.AccountsTableData().getAccountsData(
            destUser
          );
          //console.log('account ', account);
          if (
            transactionReq.destinationAccount.accountNumber !==
            account.account_number
          ) {
            return {
              data: {},
              messages: ["Destination account not found"],
            } as APIResponse;
          }

          if (
            transactionReq.destinationAccount.agencyNumber !==
            account.agency_number
          ) {
            return {
              data: {},
              messages: ["Destination agency not found"],
            } as APIResponse;
          }

          if (
            transactionReq.destinationAccount.agencyVerificationCode !==
            account.agency_verification_code
          ) {
            return {
              data: {},
              messages: ["Destination agency verify digit not found"],
            } as APIResponse;
          }

          if (
            transactionReq.destinationAccount.accountVerificationCode !==
            account.account_verification_code
          ) {
            return {
              data: {},
              messages: ["Destination account verify digit not found"],
            } as APIResponse;
          }

          const date = new this.DateWriter(new Date());
          const taxID = v4();
          const transacOrID = v4();
          const transacDesID = v4();

          const transactionTax: TransactionDB = {
            id: taxID,
            destinationAccountID: "bank",
            originAccountID: orAccount.id,
            value: 1,
            date: date.date,
            type: "transfer tax",
          };

          const transacOrigin: TransactionDB = {
            id: transacOrID,
            destinationAccountID: account.id,
            originAccountID: orAccount.id,
            value: transactionReq.amount,
            date: date.date,
            type: "transfer",
          };

          const transacDestination: TransactionDB = {
            id: transacDesID,
            destinationAccountID: account.id,
            originAccountID: orAccount.id,
            value: transactionReq.amount,
            date: date.date,
            type: "deposit",
          };

          const updateOrData: AccountUpdate = {
            accountId: orAccount.id,
            value: Number(orAccount.balance) - Number(transactionReq.amount) - 1.0,
          };

          const updateDestData: AccountUpdate = {
            accountId: account.id,
            value: Number(account.balance) + Number(transactionReq.amount),
          };

          console.log('updateDesti ', updateDestData);

          const response: TransferResponse = {
            data: {
              transactionID: transacOrID,
              type: "transfer",
              value: transactionReq.amount.toString(),
              date: date.date,
              originAccount: {
                agencyNumber: orAccount.agency_number,
                agencyVerificationCode: orAccount.agency_verification_code,
                accountNumber: orAccount.account_number,
                accountVerificationCode: orAccount.account_verification_code,
                document: originUser.document,
              },
              destinationAccount: {
                agencyNumber: account.agency_number,
                agencyVerificationCode: account.agency_verification_code,
                accountNumber: account.account_number,
                accountVerificationCode: account.account_verification_code,
                document: destUser.document,
              },
            },
          };
          //console.log('withdrawaltax ', withdrawalTax);
          const transferTaxTransaction = await new this.TransferTable().insert(
            transactionTax
          );

          //console.log('withdrawalTaxTransaction ', withdrawalTaxTransaction);
          const transferOriginTransaction =
            await new this.TransferTable().insert(transacOrigin);

          const transferDestinationTransaction =
            await new this.TransferTable().insert(transacDestination);
          //console.log('updateData ', updateData);
          const updateOriginAccount =
            await new this.UpdateAccountTable().update(updateOrData);

          const updateDestinyAccount =
            await new this.UpdateAccountTable().update(updateDestData);
          //console.log('updateAccount ', updateAccount);
          if (
            transferTaxTransaction &&
            transferOriginTransaction &&
            transferDestinationTransaction &&
            updateOriginAccount &&
            updateDestinyAccount
          ) {
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
          messages: ["Destination user document not found"],
        } as APIResponse;
      }
      return {
        data: {},
        messages: ["Origin user document not found"],
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

export { CreateTransferService };
