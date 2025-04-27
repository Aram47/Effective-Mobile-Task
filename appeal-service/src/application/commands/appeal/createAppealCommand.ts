export class CreateAppealCommand {
  constructor(
    public readonly subject: string,
    public readonly text: string,
    public readonly correlationId: string
  ) {}
}