import type { NextFunction, Request, Response } from 'express';
import type { AppLanguage } from '../types/common';

const messages: Record<string, Record<AppLanguage, string>> = {
  INTERNAL: { uz: 'Ichki server xatoligi', ru: 'Внутренняя ошибка сервера', en: 'Internal server error', ko: '내부 서버 오류' },
  VALIDATION: { uz: 'Kiritilgan ma’lumotlar noto‘g‘ri', ru: 'Введены неверные данные', en: 'Invalid input data', ko: '입력한 데이터가 올바르지 않습니다' },
  NOT_FOUND: { uz: 'Ma’lumot topilmadi', ru: 'Данные не найдены', en: 'Resource not found', ko: '요청한 정보를 찾을 수 없습니다' },
  UNAUTHORIZED: { uz: 'Avtorizatsiya talab qilinadi', ru: 'Требуется авторизация', en: 'Authentication required', ko: '인증이 필요합니다' },
  FORBIDDEN: { uz: 'Bu amal uchun ruxsat yo‘q', ru: 'Недостаточно прав', en: 'You do not have permission', ko: '권한이 없습니다' },
  CONFLICT: { uz: 'Bu ma’lumot avvaldan mavjud', ru: 'Такие данные уже существуют', en: 'This resource already exists', ko: '이미 존재하는 데이터입니다' },
  BAD_CREDENTIALS: { uz: 'Email yoki parol xato', ru: 'Неверный email или пароль', en: 'Invalid email or password', ko: '이메일 또는 비밀번호가 올바르지 않습니다' }
};

export class AppError extends Error {
  constructor(public readonly code: keyof typeof messages, public readonly status: number = 500, public readonly details?: unknown) {
    super(code);
    this.name = 'AppError';
  }
  localized(language: AppLanguage): string {
    try { return messages[this.code]?.[language] ?? messages.INTERNAL[language]; } catch { return messages.INTERNAL.en; }
  }
}

export function requestLanguage(request: Request): AppLanguage {
  try {
    const header = request.get('Accept-Language')?.split(',')[0]?.trim().toLowerCase().split('-')[0];
    return header === 'uz' || header === 'ru' || header === 'en' || header === 'ko' ? header : 'uz';
  } catch { return 'uz'; }
}

export function errorHandler(error: unknown, request: Request, response: Response, _next: NextFunction): void {
  try {
    const language = requestLanguage(request);
    const appError = error instanceof AppError ? error : new AppError('INTERNAL', 500);
    if (!(error instanceof AppError)) console.error(error);
    response.status(appError.status).json({ success: false, error: { code: appError.code, message: appError.localized(language), details: appError.details } });
  } catch {
    response.status(500).json({ success: false, error: { code: 'INTERNAL', message: messages.INTERNAL.en } });
  }
}
