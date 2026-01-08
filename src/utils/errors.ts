export const errorHandlers = {
  handleApiError(context: string, error: unknown): void {
    console.error(`Ошибка ${context}:`, error);
  },

  handleSessionsLoadError(error: unknown): void {
    this.handleApiError('загрузки сеансов', error);
  },

  handleHallPlanLoadError(error: unknown): void {
    this.handleApiError('загрузки плана или билетов', error);
  },

  handleReservationError(error: unknown): void {
    this.handleApiError('при бронировании или покупке', error);
    alert('Ошибка бронирования. Проверьте авторизацию и доступность мест.');
  },

  handlePaymentError(error: unknown): void {
    this.handleApiError('оплаты', error);
    alert('Ошибка оплаты. Проверьте данные карты.');
  },

  handleReviewsLoadError(error: unknown): void {
    this.handleApiError('загрузки отзывов', error);
  },
};
