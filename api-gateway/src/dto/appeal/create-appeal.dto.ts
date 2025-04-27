export interface CreateAppealDto {
  subject: string;
  text: string;
}

export function validateCreateAppealDto(dto: CreateAppealDto): string[] {
  const errors: string[] = [];
  if (!dto.subject) errors.push('Subject is required');
  if (!dto.text) errors.push('Text is required');
  return errors;
};