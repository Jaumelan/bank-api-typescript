import { PostgresDB } from '.';
import { UserDB, TransactionValidated } from '../../../models';

class TransferDestinationUsersTable extends PostgresDB {
    public async getUserData(data: TransactionValidated): Promise<UserDB> {
        try {
            this.client.connect();

            const getBankStatementQuery = `
                    SELECT * FROM users WHERE document = $1
                `;

            const result = await this.client.query(getBankStatementQuery, [
                data.destinationAccount.document,
            ]);

            this.client.end();

            // console.log('resultUsers ', result.rows);

            if (result.rows.length !== 0) {
                return result.rows[0] as UserDB;
            }

            return {
                id: '',
                name: '',
                document: '',
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

export { TransferDestinationUsersTable };