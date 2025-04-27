export const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@postgres:5432/appeal_db',
};