import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  port: parseInt(String(process.env.PORT), 10) || 3003,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(String(process.env.DB_PORT), 10) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  },
};

export { config };
