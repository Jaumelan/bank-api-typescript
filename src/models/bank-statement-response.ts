import { BankStatementTransactions } from '.';

interface BankStatementResponse {
    agencyNumber: string;
    accountNumber: string;
    agencyVerificationCode: string;
    accountVerificationCode: string;
    document: string;
    name: string;
    balance: number;
    transactions: BankStatementTransactions[];
}

export { BankStatementResponse };