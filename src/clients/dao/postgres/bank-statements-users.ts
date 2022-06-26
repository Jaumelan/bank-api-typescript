import { PostgresDB } from '.';
import { BankStatement, UserComplete } from '../../../models';

class BankStatementUsersTable extends PostgresDB {
  public async getUserData(data: BankStatement): Promise<UserComplete> {
    try {
      this.client.connect();

      const getBankStatementQuery = `
                SELECT * FROM users WHERE document = $1
            `;

      const result = await this.client.query(getBankStatementQuery, [
        data.document,
      ]);

      this.client.end();

      console.log('resultUsers ', result.rows);

      if (result.rows.length !== 0) {
        return result.rows[0] as UserComplete;
      }

      return {
        id: '',
        name: '',
        cpf: '',
        email: '',
        password: '',
        birthdate: '',
      };
    } catch (error) {
      this.client.end();
      throw new Error('503: service temporarily unavailable');
    }
  }
}

export { BankStatementUsersTable };
