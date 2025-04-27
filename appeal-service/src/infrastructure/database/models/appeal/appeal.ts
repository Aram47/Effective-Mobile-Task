import { DataTypes, Model, Sequelize } from 'sequelize';
import { AppealStatus } from '../../../../domain/appeal/entities/appeal.js';

export class AppealModel extends Model {
  public id!: string;
  public topic!: string;
  public text!: string;
  public status!: AppealStatus;
  public resolution?: string;
  public cancellationReason?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export function initAppealModel(sequelize: Sequelize) {
  AppealModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      topic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(AppealStatus)),
        defaultValue: AppealStatus.NEW,
        allowNull: false,
      },
      resolution: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cancellationReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'appeals',
      timestamps: true,
    }
  );
}