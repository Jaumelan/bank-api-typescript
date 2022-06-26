import { PostgresDB } from '.';
import { UserComplete } from '../../../models';

class UsersTable extends PostgresDB {
  public async insert(user: UserComplete): Promise<boolean> {
    try {
      this.client.connect();

      const insertUserQuery = `
                INSERT INTO users (
                    id,
                    name,
                    email,
                    birthdate,
                    document,
                    password
                ) VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                ) RETURNING id
            `;

      const result = await this.client.query(insertUserQuery, [
        user.id,
        user.name,
        user.email,
        user.birthdate,
        user.cpf,
        user.password,
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

export { UsersTable };
