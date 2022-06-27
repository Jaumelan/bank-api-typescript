import { v4 } from 'uuid';
import { APIResponse, User, UserComplete, WithdrawalReq } from '../models';
import { ExceptionTreatment, DateWriter } from '../utils';
import { WithdrawalReqValidator } from '../validators';
import { WithdrawalUsersTable } from '../clients/dao/postgres/withdrawal-users';
import { WithdrawalAccountTable } from '../clients/dao/postgres/withdrawal-account';

class CreateWithdrawalService {
private WithdrawalValidator = WithdrawalReqValidator;

private UsersTableData = WithdrawalUsersTable;

private AccountsTableData = WithdrawalAccountTable;

private DateWriter = DateWriter;

public async execute(request: WithdrawalReq): Promise<APIResponse> {
    try {
        const DataValidated = new this.WithdrawalValidator(request);

        if (DataValidated.errors) {
            throw new Error(`400: ${DataValidated.errors}`);
        }

        const withdrawalReq = DataValidated.withdrawalReq;

        const user = await new this.UsersTableData().getUserData(withdrawalReq);

        if (user.id !== '') {
            const account = await new this.AccountsTableData().getAccountsData(user);

            if (withdrawalReq.account.accountNumber !== account.account_number) {
                return {
                    data: {},
                    messages: ['Account not found'],
                } as APIResponse;
            }

            if (withdrawalReq.account.agencyNumber !== account.agency_number) {
                return {
                    data: {},
                    messages: ['Agency not found'],
                } as APIResponse;
            }

            if (withdrawalReq.account.agencyVerificationCode !== account.agency_verification_code) {
                return {
                    data: {},
                    messages: ['Agency verify digit not found'],
                } as APIResponse;
            }

            if (withdrawalReq.account.accountVerificationCode !== account.account_verification_code) {
                return {
                    data: {},
                    messages: ['Account verify digit not found'],
                } as APIResponse;
            }

            const date = new this.DateWriter(new Date());
            const withdrawal = {
                id: v4(),
                user_id: user.id,
                account_id: account.id,
                amount: withdrawalReq.value,
                date: date.date,
            };

            const result = await new this.AccountsTableData().createWithdrawal(withdrawal);

            return {
                data: result,
                messages: ['Withdrawal created'],
            } as APIResponse;
        }
    }
}

export { CreateWithdrawalService };
