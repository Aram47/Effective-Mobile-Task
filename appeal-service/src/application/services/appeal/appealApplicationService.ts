import { CreateAppealHandler } from '../../handlers/appeal/createAppealHandler.js';
import { CreateAppealCommand } from '../../commands/appeal/createAppealCommand.js';

export class AppealApplicationService {
  constructor(private createAppealHandler: CreateAppealHandler) {}

  async createAppeal(subject: string, text: string, correlationId: string): Promise<void> {
    const command = new CreateAppealCommand(subject, text, correlationId);
    await this.createAppealHandler.handle(command);
  }
}