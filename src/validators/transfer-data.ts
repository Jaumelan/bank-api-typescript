import {
    AgencyNumberValidator,
    AccountNumberValidator,
    VerifyDigitAccountValidator,
    VerifyDigitAgencyValidator,
    CPFValidator,
    AmountValidator,
    PasswordValidator
  } from ".";
  import { TransactionRequisition, TransactionValidated } from "../models";

class TransferValidator {
    public transactionReq: TransactionValidated;

    public errors: string;

    private AgencyNumberValidator = AgencyNumberValidator;

    private AccountNumberValidator = AccountNumberValidator;

    private VerifyDigitAccountValidator = VerifyDigitAccountValidator;

    private VerifyDigitAgencyValidator = VerifyDigitAgencyValidator;

    private CPFValidator = CPFValidator;

    //private PasswordValidator = PasswordValidator;

    private amountValidator = AmountValidator;

    public constructor (transactionReq: TransactionRequisition) {
        this.errors = '';
        this.transactionReq = this.validate(transactionReq);
    }

    private validate (transactionReq: TransactionRequisition): TransactionValidated {
        const {
            originAccount, destinationAccount, amount,
        } = transactionReq;

        const orAgencyValidated = new this.AgencyNumberValidator(originAccount.agencyNumber);
        const orAccountValidated = new this.AccountNumberValidator(originAccount.accountNumber);
        const orDigitAccountValidated = new this.VerifyDigitAccountValidator(originAccount.accountVerificationCode, originAccount.accountNumber);
        const orDigitAgencyValidated = new this.VerifyDigitAgencyValidator(originAccount.agencyVerificationCode, originAccount.agencyNumber);
        const orCpfValidated = new this.CPFValidator(originAccount.document);
        //const orPasswordValidated = new this.PasswordValidator(originAccount.password);
        const orAmountValidated = new this.amountValidator(Number(amount));
        const deAgencyValidated = new this.AgencyNumberValidator(destinationAccount.agencyNumber);
        const deAccountValidated = new this.AccountNumberValidator(destinationAccount.accountNumber);
        const deDigitAccountValidated = new this.VerifyDigitAccountValidator(destinationAccount.accountVerificationCode, destinationAccount.accountNumber);
        const deDigitAgencyValidated = new this.VerifyDigitAgencyValidator(destinationAccount.agencyVerificationCode, destinationAccount.agencyNumber);
        const deCpfValidated = new this.CPFValidator(destinationAccount.document);

        this.errors = orAgencyValidated.errors
                + orAccountValidated.errors
                + orDigitAccountValidated.errors
                + orDigitAgencyValidated.errors
                + orCpfValidated.errors
                + orAmountValidated.errors
                + deAgencyValidated.errors
                + deAccountValidated.errors
                + deDigitAccountValidated.errors
                + deDigitAgencyValidated.errors
                + deCpfValidated.errors;

        // console.log("depositReq ", this.errors);
        const transactionReqValidated: TransactionValidated = {
            originAccount: {
                agencyNumber: orAgencyValidated.agency,
                accountNumber: orAccountValidated.account,
                accountVerificationCode: orDigitAccountValidated.verifyDigitAccount,
                agencyVerificationCode: orDigitAgencyValidated.verifyDigitAgency,
                document: orCpfValidated.cpf,
                password: originAccount.password,
            },
            destinationAccount: {
                agencyNumber: deAgencyValidated.agency,
                accountNumber: deAccountValidated.account,
                accountVerificationCode: deDigitAccountValidated.verifyDigitAccount,
                agencyVerificationCode: deDigitAgencyValidated.verifyDigitAgency,
                document: deCpfValidated.cpf,
            },
            amount: orAmountValidated.value,
        };

        return transactionReqValidated;
    }
}

export { TransferValidator };
