import { Pool } from 'pg';
import { logger } from '../../../shared/utils/logger.js';

export class PostgreConnection {
  private static pool: Pool;

  static async getPool(): Promise<Pool> {
    if (!PostgreConnection.pool) {
      PostgreConnection.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      PostgreConnection.pool.on('error', (err) => {
        logger.error('Unexpected error on idle client', err);
        process.exit(-1);
      });

      // Инициализация таблицы
      const client = await PostgreConnection.pool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS appeals (
            id VARCHAR(36) PRIMARY KEY,
            subject TEXT NOT NULL,
            text TEXT NOT NULL,
            status VARCHAR(50) NOT NULL,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL
          )
        `);
        logger.info('Appeals table initialized');
      } finally {
        client.release();
      }
    }
    return PostgreConnection.pool;
  }
}