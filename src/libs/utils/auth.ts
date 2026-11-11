import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../../models/Auth.service";
import { MemberService } from "../../models/Member.service";
import { MemberStatus } from "../enums/member.enum";
import { AppError, HttpCode } from "./Errors";

type Identity = { memberId: string; sessionId: string };

async function requireActiveMember(token: string): Promise<Identity> {
  const signedIdentity = await AuthService.identify(token);
  const status = await MemberService.getStatus(signedIdentity.memberId);
  if (status === MemberStatus.PAUSED || status === MemberStatus.BLOCKED) {
    throw new AppError("ACCOUNT_SUSPENDED", HttpCode.FORBIDDEN, { status });
  }
  return AuthService.verify(token);
}

export async function requireAuth(
  request: Request,
  _response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const header = request.get("authorization");
    const token = header?.startsWith("Bearer ")
      ? header.slice(7)
      : request.cookies?.avto_session;
    if (!token) throw new AppError("UNAUTHORIZED", HttpCode.UNAUTHORIZED);
    const identity = await requireActiveMember(token);
    Object.assign(request, {
      memberId: identity.memberId,
      sessionId: identity.sessionId,
    });
    next();
  } catch (error) {
    next(error);
  }
}

export async function requireAdmin(
  request: Request,
  _response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = request.cookies?.avto_session as string | undefined;
    if (!token) throw new AppError("UNAUTHORIZED", HttpCode.UNAUTHORIZED);
    const identity = await requireActiveMember(token);
    if (!(await MemberService.isActiveAdmin(identity.memberId)))
      throw new AppError("FORBIDDEN", HttpCode.FORBIDDEN);
    Object.assign(request, {
      memberId: identity.memberId,
      sessionId: identity.sessionId,
    });
    next();
  } catch (error) {
    next(error);
  }
}

export async function requireSeller(
  request: Request,
  _response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const header = request.get("authorization");
    const token = header?.startsWith("Bearer ")
      ? header.slice(7)
      : request.cookies?.avto_session;
    if (!token) throw new AppError("UNAUTHORIZED", HttpCode.UNAUTHORIZED);
    const identity = await requireActiveMember(token);
    if (!(await MemberService.isActiveSeller(identity.memberId)))
      throw new AppError("FORBIDDEN", HttpCode.FORBIDDEN);
    Object.assign(request, {
      memberId: identity.memberId,
      sessionId: identity.sessionId,
    });
    next();
  } catch (error) {
    next(error);
  }
}

export async function requireSellerOrAdmin(
  request: Request,
  _response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const header = request.get("authorization");
    const token = header?.startsWith("Bearer ")
      ? header.slice(7)
      : request.cookies?.avto_session;
    if (!token) throw new AppError("UNAUTHORIZED", HttpCode.UNAUTHORIZED);
    const identity = await requireActiveMember(token);
    const [isSeller, isAdmin] = await Promise.all([
      MemberService.isActiveSeller(identity.memberId),
      MemberService.isActiveAdmin(identity.memberId),
    ]);
    if (!isSeller && !isAdmin) throw new AppError("FORBIDDEN", HttpCode.FORBIDDEN);
    Object.assign(request, {
      memberId: identity.memberId,
      sessionId: identity.sessionId,
      isAdmin,
    });
    next();
  } catch (error) {
    next(error);
  }
}
