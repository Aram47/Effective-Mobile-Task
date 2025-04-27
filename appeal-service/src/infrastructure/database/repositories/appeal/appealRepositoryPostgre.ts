import { Pool } from 'pg';
import { Appeal } from '../../../../domain/appeal/entities/appeal.js';
import { IAppealRepository } from '../../../../domain/appeal/repositories/iappealRepository.js';
import { PostgreConnection } from '../../connections/postgreConnection.js';
import { logger } from '../../../../shared/utils/logger.js';

export class AppealRepositoryPostgre implements IAppealRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool();
    this.init();
  }

  private async init() {
    this.pool = await PostgreConnection.getPool();
  }

  async save(appeal: Appeal): Promise<void> {
    const query = `
      INSERT INTO appeals (id, subject, text, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [
      appeal.getId(),
      appeal.getSubject(),
      appeal.getText(),
      appeal.getStatus(),
      appeal.getCreatedAt(),
      appeal.getUpdatedAt(),
    ];
    await this.pool.query(query, values);
    logger.info(`Appeal saved to database: ${appeal.getId()}`);
  }

  async findById(id: string): Promise<Appeal | null> {
    const query = 'SELECT * FROM appeals WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    const appeal = new Appeal(row.subject, row.text);
    // Здесь нужно вручную установить свойства, так как конструктор создает новый ID
    Object.defineProperties(appeal, {
      id: { value: row.id, writable: false },
      status: { value: row.status, writable: false },
      createdAt: { value: new Date(row.created_at), writable: false },
      updatedAt: { value: new Date(row.updated_at), writable: false },
    });
    return appeal;
  }
}