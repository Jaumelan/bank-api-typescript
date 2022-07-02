import { PostgresDB } from ".";
import { TransactionDB, AccountDB } from "../../../models";

class TransactionsTable extends PostgresDB {
    public async getTransactionsData(data: AccountDB): Promise<TransactionDB[]> {
        try {
            this.client.connect();

            const getTransactionsQuery = `
                SELECT * FROM transactions WHERE origin_account_id = $1 OR destination_account_id = $1
            `;

            const result = await this.client.query(getTransactionsQuery, [data.id]);

            this.client.end();

            return result.rows as TransactionDB[];
        } catch (error) {
            this.client.end();
            throw new Error("503: service temporarily unavailable");
        }
    }
}

export { TransactionsTable };