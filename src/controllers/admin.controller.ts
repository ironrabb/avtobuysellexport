import type { Request, Response, NextFunction } from "express";
import { CarService } from "../models/Car.service";
import { AppError, HttpCode, requestLanguage } from "../libs/utils/Errors";
import { CarStatus } from "../libs/enums/car.enum";
import { MemberService } from "../models/Member.service";
import { AuthService } from "../models/Auth.service";
import { MemberStatus } from "../libs/enums/member.enum";
import type { AppLanguage } from "../libs/types/common";
import { adminConfirmDeleteUser, adminText } from "../libs/utils/admin-i18n";

function viewLanguage(request: Request): AppLanguage {
  const explicit = String(
    request.query.lang ?? request.body?.lang ?? "",
  ).toLowerCase();
  if (
    explicit === "uz" ||
    explicit === "ru" ||
    explicit === "en" ||
    explicit === "ko"
  )
    return explicit;
  return requestLanguage(request);
}

export class AdminController {
  static async loginForm(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const language = viewLanguage(request);
      response.render("admin/login", {
        title: adminText(language).login,
        error: null,
        language,
        t: adminText(language),
      });
    } catch (error) {
      next(error);
    }
  }
  static async login(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const language = viewLanguage(request);
      const { email, password } = request.body ?? {};
      if (typeof email !== "string" || typeof password !== "string")
        throw new AppError("VALIDATION", HttpCode.BAD_REQUEST);
      const member = await MemberService.authenticate(email, password);
      if (!(await MemberService.isActiveAdmin(String(member.id))))
        throw new AppError("FORBIDDEN", HttpCode.FORBIDDEN);
      const session = await AuthService.create(String(member.id));
      response.cookie("avto_session", session.token, {
        httpOnly: true,
        secure: request.secure,
        sameSite: "lax",
        maxAge: 7 * 86400000,
        path: "/",
      });
      response.redirect(`/admin/cars?lang=${language}`);
    } catch (error) {
      next(error);
    }
  }
  static async dashboard(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const language = viewLanguage(request);
      const page = Math.max(1, Number(request.query.page) || 1);
      const listing = await CarService.listForAdmin(page);
      response.render("admin/cars", {
        cars: listing.items,
        total: listing.total,
        page: listing.page,
        pages: listing.pages,
        title: adminText(language).manageCars,
        language,
        t: adminText(language),
      });
    } catch (error) {
      next(error);
    }
  }
  static async moderate(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const language = viewLanguage(request);
      const statusMap: Record<string, CarStatus> = {
        approve: CarStatus.ACTIVE,
        reject: CarStatus.REJECTED,
        pause: CarStatus.PAUSED,
        block: CarStatus.BLOCKED,
        activate: CarStatus.ACTIVE,
      };
      const status = statusMap[String(request.body.action)];
      if (!status) throw new AppError("VALIDATION", HttpCode.BAD_REQUEST);
      await CarService.setAdminStatus(request.params.id, status);
      response.redirect(`/admin/cars?lang=${language}`);
    } catch (error) {
      next(error);
    }
  }
  static async users(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const language = viewLanguage(request);
      const page = Math.max(1, Number(request.query.page) || 1);
      const listing = await MemberService.listForAdmin(page);
      response.render("admin/users", {
        users: listing.items,
        total: listing.total,
        page: listing.page,
        pages: listing.pages,
        title: adminText(language).manageUsers,
        language,
        t: adminText(language),
        confirmDeleteUser: adminConfirmDeleteUser(language),
        currentMemberId: (request as Request & { memberId?: string }).memberId,
      });
    } catch (error) {
      next(error);
    }
  }
  static async setUserStatus(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const language = viewLanguage(request);
      if (
        request.params.id ===
        String((request as Request & { memberId?: string }).memberId)
      )
        throw new AppError("FORBIDDEN", HttpCode.FORBIDDEN);
      const statusMap: Record<string, MemberStatus> = {
        activate: MemberStatus.ACTIVE,
        pause: MemberStatus.PAUSED,
        block: MemberStatus.BLOCKED,
      };
      const status = statusMap[String(request.body.action)];
      if (!status) throw new AppError("VALIDATION", HttpCode.BAD_REQUEST);
      await MemberService.setAdminStatus(request.params.id, status);
      response.redirect(`/admin/users?lang=${language}`);
    } catch (error) {
      next(error);
    }
  }
  static async deleteCar(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const language = viewLanguage(request);
      await CarService.deleteForAdmin(request.params.id);
      response.redirect(`/admin/cars?lang=${language}`);
    } catch (error) {
      next(error);
    }
  }
  static async deleteUser(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const language = viewLanguage(request);
      const memberId = request.params.id;
      if (
        memberId ===
        String((request as Request & { memberId?: string }).memberId)
      )
        throw new AppError("FORBIDDEN", HttpCode.FORBIDDEN);
      await MemberService.assertDeletableByAdmin(memberId);
      await CarService.deleteForSeller(memberId);
      await MemberService.deleteForAdmin(memberId);
      response.redirect(`/admin/users?lang=${language}`);
    } catch (error) {
      next(error);
    }
  }
}
