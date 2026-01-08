export const handleApiError = (error: unknown, context: string): void => {
  console.error(`Ошибка ${context}:`, error);
};

export const handleError = (error: unknown, message: string): void => {
  console.error(message, error);
};
