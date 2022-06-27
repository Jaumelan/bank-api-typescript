import { PostgresDB } from '.';
import { UserComplete, WithdrawalReq } from '../../../models';

class WithdrawalUsersTable extends PostgresDB {
    public async getUserData(data: WithdrawalReq): Promise<UserComplete> {
        try {
            this.client.connect();

            const getBankStatementQuery = `
                    SELECT * FROM users WHERE document = $1
                `;

            const result = await this.client.query(getBankStatementQuery, [
                data.account.document,
            ]);

            this.client.end();

            // console.log('resultUsers ', result.rows);

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

export { WithdrawalUsersTable };