import { PostgresDB } from '.';
import { TransactionDB } from '../../../models';

class TransactionsTable extends PostgresDB {
  public async insert(transaction: TransactionDB): Promise<boolean> {
    try {
      this.client.connect();

      const insertTransactionQuery = `
                    INSERT INTO transactions (
                        id,
                        date,
                        value,
                        origin_account_id,
                        destination_account_id,
                        type
                    ) VALUES (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6
                    ) RETURNING id
                `;

      const result = await this.client.query(insertTransactionQuery, [
        transaction.id,
        transaction.date,
        transaction.value,
        transaction.originAccountID,
        transaction.destinationAccountID,
        transaction.type,
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

export { TransactionsTable };
