import { PostgresDB } from '.';
import { Account } from '../../../models';

class AccountTable extends PostgresDB {
  public async insert(account: Account): Promise<boolean> {
    try {
      this.client.connect();

      const insertAccountQuery = `
                INSERT INTO accounts (
                    id,
                    agency_number,
                    agency_verify_code,
                    account_number,
                    account_verify_code,
                    balance,
                    user_id
                ) VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7
                ) RETURNING id
            `;

      const result = await this.client.query(insertAccountQuery, [
        account.id,
        account.agency,
        account.verifyDigitAgency,
        account.account,
        account.verifyDigitAccount,
        account.balance,
        account.userID,
      ]);

      this.client.end();

      if (result.rows.length !== 0) {
        return true;
      }

      return false;
    } catch (error) {
      this.client.end();
      throw new Error('503: service temporarily unavailable');
    }
  }
}

export { AccountTable };
