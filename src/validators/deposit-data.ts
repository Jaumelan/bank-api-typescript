import {
  AgencyNumberValidator,
  AccountNumberValidator,
  VerifyDigitAccountValidator,
  VerifyDigitAgencyValidator,
  CPFValidator,
  AmountValidator,
} from ".";
import { DepositRequisition, DepositValidated } from "../models";

class DepositValidator {
    public depositReq: DepositValidated;

    public errors: string;

    private AgencyNumberValidator = AgencyNumberValidator;

    private AccountNumberValidator = AccountNumberValidator;

    private VerifyDigitAccountValidator = VerifyDigitAccountValidator;

    private VerifyDigitAgencyValidator = VerifyDigitAgencyValidator;

    private CPFValidator = CPFValidator;

    private amountValidator = AmountValidator;

    public constructor (depositReq: DepositRequisition) {
        this.errors = '';
        this.depositReq = this.validate(depositReq);
    }

    private validate (depositReq: DepositRequisition): DepositValidated {
        const {
            account, value,
        } = depositReq;

        const agencyValidated = new this.AgencyNumberValidator(account.agencyNumber);
        const accountValidated = new this.AccountNumberValidator(account.accountNumber);
        const DigitAccountValidated = new this.VerifyDigitAccountValidator(account.accountVerificationCode, account.accountNumber);
        const DigitAgencyValidated = new this.VerifyDigitAgencyValidator(account.agencyVerificationCode, account.agencyNumber);
        const cpfValidated = new this.CPFValidator(account.document);
        const amountValidated = new this.amountValidator(Number(value));

        this.errors = agencyValidated.errors
                + accountValidated.errors
                + DigitAccountValidated.errors
                + DigitAgencyValidated.errors
                + cpfValidated.errors
                + amountValidated.errors;

        // console.log("depositReq ", this.errors);
        const depositReqValidated: DepositValidated = {
            account: {
                agencyNumber: agencyValidated.agency,
                accountNumber: accountValidated.account,
                accountVerificationCode: DigitAccountValidated.verifyDigitAccount,
                agencyVerificationCode: DigitAgencyValidated.verifyDigitAgency,
                document: cpfValidated.cpf,
            },
            value: amountValidated.value,
        };

        return depositReqValidated;
    }
}

export { DepositValidator };