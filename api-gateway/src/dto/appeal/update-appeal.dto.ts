export interface UpdateAppealDto {
  resolution?: string;
  cancellationReason?: string;
}

export function validateUpdateAppealDto(dto: UpdateAppealDto, action: string): string[] {
  const errors: string[] = [];
  if (action === 'complete' && !dto.resolution) {
    errors.push('Resolution is required for completing an appeal');
  }
  if (action === 'cancel' && !dto.cancellationReason) {
    errors.push('Cancellation reason is required for cancelling an appeal');
  }
  return errors;
};