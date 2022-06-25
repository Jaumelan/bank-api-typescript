import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3003,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    name: process.env.DB_NAME,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  },
};

export { config };
