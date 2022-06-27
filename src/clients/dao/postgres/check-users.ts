import { PostgresDB } from ".";

class CheckUsersTable extends PostgresDB {
    public async getUserData(data: string): Promise<boolean> {
        try {
            this.client.connect();

            const getBankStatementQuery = `
                    SELECT document FROM users WHERE document = $1
                `;

            const result = await this.client.query(getBankStatementQuery, [
                data,
            ]);

            this.client.end();

            // console.log('resultUsers ', result.rows);

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

export { CheckUsersTable };