import { Sequelize } from 'sequelize';
import { initAppealModel } from './models/appeal/appeal.js';

export function initDatabase() {
  const sequelize = new Sequelize(process.env.DATABASE_URL!, {
    dialect: 'postgres',
    logging: false,
  });

  initAppealModel(sequelize);

  return sequelize;
}