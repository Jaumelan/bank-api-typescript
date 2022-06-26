import { Client } from 'pg';
import { config } from '../../../config';

class PostgresDB {
  protected client: Client;

  public constructor() {
    this.client = new Client({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.name,
    });
  }
}

export { PostgresDB };
