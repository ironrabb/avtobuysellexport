export type AppLanguage = "uz" | "ru" | "en" | "ko";
export interface AuthenticatedRequest {
  memberId?: string;
  memberType?: string;
}
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
