import { PostgresDB } from '.';
import { Account, UserComplete } from '../../../models';

class BankStatementAccountsTable extends PostgresDB {
  public async getAccountsData(data: UserComplete): Promise<Account> {
    try {
      this.client.connect();

      const getBankStatementQuery = `
                SELECT * FROM accounts WHERE user_id = $1
            `;

      const result = await this.client.query(getBankStatementQuery, [
        data.id,
      ]);

      this.client.end();

      console.log('resultAccounts ', result.rows);

      if (result.rows.length !== 0) {
        return result.rows[0] as Account;
      }

      return {
        id: '',
        userID: '',
        agency: '',
        verifyDigitAgency: '',
        account: '',
        verifyDigitAccount: '',
        balance: 0,
      };
    } catch (error) {
      this.client.end();
      throw new Error('503: service temporarily unavailable');
    }
  }
}

export { BankStatementAccountsTable };
