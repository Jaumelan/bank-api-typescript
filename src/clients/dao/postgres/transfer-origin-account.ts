import { PostgresDB } from ".";
import { AccountDB, UserDB } from "../../../models";

class WithdrawalAccountTable extends PostgresDB {
  public async getAccountsData(data: UserDB): Promise<AccountDB> {
    try {
      this.client.connect();

      const getBankStatementQuery = `
                SELECT * FROM accounts WHERE user_id = $1
            `;

      const result = await this.client.query(getBankStatementQuery, [
        data.id,
      ]);

      this.client.end();

      // console.log('resultAccounts ', result.rows);

      if (result.rows.length !== 0) {
        return result.rows[0] as AccountDB;
      }

      return {
        id: "",
        user_id: "",
        agency_number: "",
        agency_verification_code: "",
        account_number: "",
        account_verification_code: "",
        balance: 0,
        password: "",
      };
    } catch (error) {
      this.client.end();
      throw new Error("503: service temporarily unavailable");
    }
  }
}

export { WithdrawalAccountTable };