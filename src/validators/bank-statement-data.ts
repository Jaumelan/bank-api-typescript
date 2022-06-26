import {
  AccountNumberValidator,
  AgencyNumberValidator,
  VerifyDigitAgencyValidator,
  VerifyDigitAccountValidator,
  CPFValidator,
} from '.';
import { RequestBankStatement, BankStatement } from '../models';

class BankStatementDataValidator {
  public bankStatement: BankStatement;

  public errors: string;

  private AccountNumberValidator = AccountNumberValidator;

  private VerifyDigitAgencyValidator = VerifyDigitAgencyValidator;

  private VerifyDigitAccountValidator = VerifyDigitAccountValidator;

  private AgencyNumberValidator = AgencyNumberValidator;

  private CPFValidator = CPFValidator;

  public constructor(requestBankStatement: RequestBankStatement) {
    this.errors = '';
    this.bankStatement = this.validate(requestBankStatement);
  }

  private validate(requestBankStatement: RequestBankStatement): BankStatement {
    const {
      accountNumber,
      agencyNumber,
      agencyVerificationCode,
      accountVerificationCode,
      document,
    } = requestBankStatement;

    const agencyNumberValidated = new this.AgencyNumberValidator(agencyNumber);
    const accountNumberValidated = new this.AccountNumberValidator(accountNumber);
    const vDAgencyVal = new this.VerifyDigitAgencyValidator(agencyVerificationCode, agencyNumber);
    const vDAccouVal = new this.VerifyDigitAccountValidator(accountVerificationCode, accountNumber);
    const cpfValidated = new this.CPFValidator(document);

    this.errors = accountNumberValidated.errors
            + vDAgencyVal.errors
            + vDAccouVal.errors
            + cpfValidated.errors;

    // console.log("userdata ", this.errors);
    const BankStatementValidated: BankStatement = {
      accountNumber: accountNumberValidated.account,
      agencyNumber: agencyNumberValidated.agency,
      agencyVerificationCode: vDAgencyVal.verifyDigitAgency,
      accountVerificationCode: vDAccouVal.verifyDigitAccount,
      document: cpfValidated.cpf,
    };

    return BankStatementValidated;
  }
}

export { BankStatementDataValidator };
