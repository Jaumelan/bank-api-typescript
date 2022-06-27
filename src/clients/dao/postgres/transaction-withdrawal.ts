import { PostgresDB } from '.';
import { TransactionDB } from '../../../models';

class TransactionTable extends PostgresDB {
  public async insert(data: TransactionDB): Promise<boolean> {
    try {
      this.client.connect();

      const insertTransactionQuery = `
                    INSERT INTO transactions (
                        id,
                        date,
                        value,
                        type,
                        origin_account_id,
                        destination_account_id,
                    ) VALUES (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6,
                    ) RETURNING id
                `;

      const result = await this.client.query(insertTransactionQuery, [
        data.id,
        data.date,
        data.value,
        data.type,
        data.originAccountID,
        data.destinationAccountID,
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

export { TransactionTable };
