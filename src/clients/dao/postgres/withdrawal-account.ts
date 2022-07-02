import { PostgresDB } from ".";
import { AccountDB, UserDB } from "../../../models";

class WithdrawalAccountTable extends PostgresDB {
  public async getAccountsData(data: UserDB): Promise<AccountDB[]> {
    try {
      this.client.connect();

      const getBankStatementQuery = `
                SELECT * FROM accounts WHERE user_id = $1
            `;

      const result = await this.client.query(getBankStatementQuery, [data.id]);

      this.client.end();

      // console.log('resultAccounts ', result.rows);
      //console.log(result.rows)

      return result.rows as AccountDB[];
    } catch (error) {
      this.client.end();
      throw new Error("503: service temporarily unavailable");
    }
  }
}

export { WithdrawalAccountTable };
