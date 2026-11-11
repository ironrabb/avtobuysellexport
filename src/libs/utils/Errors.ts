import type { NextFunction, Request, Response } from "express";
import type { AppLanguage } from "../types/common";

/** HTTP javob statuslari. 304 xato emas: klientdagi cache o'zgarmaganini anglatadi. */
export enum HttpCode {
  OK = 200, // So'rov muvaffaqiyatli bajarildi.
  CREATED = 201, // Yangi resurs yaratildi.
  NOT_MODIFIED = 304, // Resurs o'zgarmagan; klient cache'dagi nusxani ishlatadi, body bo'lmaydi.
  BAD_REQUEST = 400, // So'rov ma'lumotlari noto'g'ri yoki yaroqsiz.
  UNAUTHORIZED = 401, // Tizimga kirish talab qilinadi yoki token yaroqsiz.
  FORBIDDEN = 403, // Foydalanuvchi tanilgan, ammo bu amalga ruxsati yo'q.
  NOT_FOUND = 404, // So'ralgan resurs topilmadi.
  CONFLICT = 409, // So'rov mavjud ma'lumot bilan ziddiyatda, masalan takroriy email.
  PAYLOAD_TOO_LARGE = 413, // Yuborilgan body yoki fayl ruxsat etilgan hajmdan katta.
  TOO_MANY_REQUESTS = 429, // So'rovlar belgilangan limitdan oshdi.
  INTERNAL_SERVER_ERROR = 500, // Serverda kutilmagan ichki xatolik yuz berdi.
}
const messages = {
  INTERNAL: {
    uz: "Ichki server xatoligi",
    ru: "Внутренняя ошибка сервера",
    en: "Internal server error",
    ko: "서버 내부 오류입니다",
  },
  VALIDATION: {
    uz: "Kiritilgan ma’lumotlar noto‘g‘ri",
    ru: "Введены некорректные данные",
    en: "Invalid input data",
    ko: "입력한 정보가 올바르지 않습니다",
  },
  NOT_FOUND: {
    uz: "Ma’lumot topilmadi",
    ru: "Данные не найдены",
    en: "Resource not found",
    ko: "요청한 정보를 찾을 수 없습니다",
  },
  UNAUTHORIZED: {
    uz: "Avtorizatsiya talab qilinadi",
    ru: "Требуется авторизация",
    en: "Authentication required",
    ko: "로그인이 필요합니다",
  },
  FORBIDDEN: {
    uz: "Bu amal uchun ruxsat yo‘q",
    ru: "Недостаточно прав для этого действия",
    en: "You do not have permission",
    ko: "이 작업을 수행할 권한이 없습니다",
  },
  CONFLICT: {
    uz: "Bu ma’lumot avvaldan mavjud",
    ru: "Такие данные уже существуют",
    en: "This resource already exists",
    ko: "이미 존재하는 정보입니다",
  },
  BAD_CREDENTIALS: {
    uz: "Email yoki parol xato",
    ru: "Неверный адрес почты или пароль",
    en: "Invalid email or password",
    ko: "이메일 또는 비밀번호가 올바르지 않습니다",
  },
  ACCOUNT_SUSPENDED: {
    uz: "Hisobingiz vaqtincha pauza qilingan yoki bloklangan. Yordam uchun adminga murojaat qiling.",
    ru: "Ваша учетная запись временно приостановлена или заблокирована. Обратитесь к администратору.",
    en: "Your account is temporarily paused or blocked. Please contact the admin.",
    ko: "계정이 일시 중지되거나 차단되었습니다. 관리자에게 문의해 주세요.",
  },
} as const;

export type ErrorCode = keyof typeof messages;
/** Har bir ilova xatosi uchun standart HTTP status. */
const defaultHttpStatus: Record<ErrorCode, HttpCode> = {
  INTERNAL: HttpCode.INTERNAL_SERVER_ERROR,
  VALIDATION: HttpCode.BAD_REQUEST,
  NOT_FOUND: HttpCode.NOT_FOUND,
  UNAUTHORIZED: HttpCode.UNAUTHORIZED,
  FORBIDDEN: HttpCode.FORBIDDEN,
  CONFLICT: HttpCode.CONFLICT,
  BAD_CREDENTIALS: HttpCode.UNAUTHORIZED,
  ACCOUNT_SUSPENDED: HttpCode.FORBIDDEN,
};

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly status: HttpCode = defaultHttpStatus[code],
    public readonly details?: unknown,
  ) {
    super(code);
    this.name = "AppError";
  }
  localized(language: AppLanguage): string {
    try {
      return messages[this.code]?.[language] ?? messages.INTERNAL[language];
    } catch {
      return messages.INTERNAL.en;
    }
  }
}

export function requestLanguage(request: Request): AppLanguage {
  try {
    const selected = String(request.body?.lang ?? request.query.lang ?? "")
      .trim()
      .toLowerCase();
    if (
      selected === "uz" ||
      selected === "ru" ||
      selected === "en" ||
      selected === "ko"
    )
      return selected;
    const header = request
      .get("Accept-Language")
      ?.split(",")[0]
      ?.trim()
      .toLowerCase()
      .split("-")[0];
    return header === "uz" ||
      header === "ru" ||
      header === "en" ||
      header === "ko"
      ? header
      : "uz";
  } catch {
    return "uz";
  }
}

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction,
): void {
  try {
    const language = requestLanguage(request);
    const appError =
      error instanceof AppError
        ? error
        : new AppError("INTERNAL", HttpCode.INTERNAL_SERVER_ERROR);
    if (!(error instanceof AppError)) console.error(error);
    response.status(appError.status).json({
      success: false,
      error: {
        code: appError.code,
        message: appError.localized(language),
        details: appError.details,
      },
    });
  } catch {
    response.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: { code: "INTERNAL", message: messages.INTERNAL.en },
    });
  }
}
