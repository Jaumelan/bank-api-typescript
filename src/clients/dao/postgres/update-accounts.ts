import { PostgresDB } from ".";
import { AccountUpdate } from "../../../models";

class UpdateAccountTable extends PostgresDB {
  public async update(data: AccountUpdate): Promise<boolean> {
    try {
      this.client.connect();

      const updateAccountQuery = `
                UPDATE accounts SET
                    balance = $1
                WHERE id = $2
                RETURNING id
            `;

      const result = await this.client.query(updateAccountQuery, [
        data.value,
        data.accountId,
      ]);

      this.client.end();

      if (result.rows.length !== 0) {
        return true;
      }

      return false;
    } catch (error) {
      this.client.end();
      throw new Error("503: service temporarily unavailable");
    }
  }
}

export { UpdateAccountTable };
