// import { Appeal, AppealStatus } from '../entities/appeal';
// import { AppealModel } from '../../../infrastructure/database/models/appeal.js';
// import { Op } from 'sequelize';

// export interface AppealRepository {
//   create(appeal: Partial<Appeal>): Promise<Appeal>;
//   findById(id: string): Promise<Appeal | null>;
//   update(appeal: Appeal): Promise<Appeal>;
//   findByDateRange(startDate?: string, endDate?: string): Promise<Appeal[]>;
//   findByDate(date: string): Promise<Appeal[]>;
//   findAllInProgress(): Promise<Appeal[]>;
// }

// export class AppealRepositoryImpl implements AppealRepository {
//   async create(appeal: Partial<Appeal>): Promise<Appeal> {
//     return AppealModel.create(appeal) as unknown as Appeal;
//   }

//   async findById(id: string): Promise<Appeal | null> {
//     return AppealModel.findByPk(id) as unknown as Appeal | null;
//   }

//   async update(appeal: Appeal): Promise<Appeal> {
//     await AppealModel.update(appeal, { where: { id: appeal.id } });
//     return appeal;
//   }

//   async findByDateRange(startDate?: string, endDate?: string): Promise<Appeal[]> {
//     const where: any = {};
//     if (startDate && endDate) {
//       where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
//     }
//     return AppealModel.findAll({ where }) as unknown as Appeal[];
//   }

//   async findByDate(date: string): Promise<Appeal[]> {
//     const start = new Date(date);
//     const end = new Date(start);
//     end.setDate(start.getDate() + 1);
//     return AppealModel.findAll({
//       where: {
//         createdAt: { [Op.between]: [start, end] },
//       },
//     }) as unknown as Appeal[];
//   }

//   async findAllInProgress(): Promise<Appeal[]> {
//     return AppealModel.findAll({
//       where: { status: AppealStatus.IN_PROGRESS },
//     }) as unknown as Appeal[];
//   }
// }

import { Appeal } from '../entities/appeal.js';

export interface IAppealRepository {
  save(appeal: Appeal): Promise<void>;
  findById(id: string): Promise<Appeal | null>;
}
