import {
  AgencyNumberValidator,
  AccountNumberValidator,
  VerifyDigitAccountValidator,
  VerifyDigitAgencyValidator,
  CPFValidator,
  PasswordValidator,
} from '.';
import { WithdrawalReq } from '../models';

class WithdrawalReqValidator {
  public withdrawalReq: WithdrawalReq;

  public errors: string;

  private AgencyNumberValidator = AgencyNumberValidator;

  private AccountNumberValidator = AccountNumberValidator;

  private VerifyDigitAccountValidator = VerifyDigitAccountValidator;

  private VerifyDigitAgencyValidator = VerifyDigitAgencyValidator;

  private CPFValidator = CPFValidator;

  private PasswordValidator = PasswordValidator;

  public constructor(withdrawalReq: WithdrawalReq) {
    this.errors = '';
    this.withdrawalReq = this.validate(withdrawalReq);
  }

  private validate(withdrawalReq: WithdrawalReq): WithdrawalReq {
    const {
      account, value,
    } = withdrawalReq;

    const agencyValidated = new this.AgencyNumberValidator(account.agencyNumber);
    const accountValidated = new this.AccountNumberValidator(account.accountNumber);
    const DigitAccountValidated = new this.VerifyDigitAccountValidator(account.accountVerificationCode, account.accountNumber);
    const DigitAgencyValidated = new this.VerifyDigitAgencyValidator(account.agencyVerificationCode, account.agencyNumber);
    const cpfValidated = new this.CPFValidator(account.document);
    const passwordValidated = new this.PasswordValidator(account.accountPassword);

    this.errors = agencyValidated.errors
            + accountValidated.errors
            + DigitAccountValidated.errors
            + DigitAgencyValidated.errors
            + cpfValidated.errors
            + passwordValidated.errors;

    // console.log("withdrawalReq ", this.errors);
    const withdrawalReqValidated: WithdrawalReq = {
      account: {
        agencyNumber: agencyValidated.agency,
        agencyVerificationCode: DigitAgencyValidated.verifyDigitAgency,
        accountNumber: accountValidated.account,
        accountVerificationCode: DigitAccountValidated.verifyDigitAccount,
        document: cpfValidated.cpf,
        accountPassword: passwordValidated.password,
      },
      value,
    };

    return withdrawalReqValidated;
  }
}

export { WithdrawalReqValidator };
