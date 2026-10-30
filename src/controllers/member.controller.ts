import type { Request, Response, NextFunction } from 'express';
import { MemberService } from '../models/Member.service';
import { AuthService } from '../models/Auth.service';
import { AppError, requestLanguage } from '../libs/utils/Errors';
import { MemberType } from '../libs/enums/member.enum';

export class MemberController {
  static async register(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      requestLanguage(request);
      const { name, email, phone, password } = request.body ?? {};
      const requestedType = request.body?.type;
      if (![name, email, phone, password].every((value) => typeof value === 'string' && value.trim()) || password.length < 8 || (requestedType !== undefined && ![MemberType.BUYER, MemberType.SELLER].includes(requestedType))) throw new AppError('VALIDATION', 400);
      const member = await MemberService.register({ name: name.trim(), email: email.trim(), phone: phone.trim(), password, type: requestedType });
      response.status(201).json({ success: true, data: member });
    } catch (error) { next(error); }
  }
  static async login(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      requestLanguage(request);
      const { email, password } = request.body ?? {};
      if (typeof email !== 'string' || typeof password !== 'string') throw new AppError('VALIDATION', 400);
      const member = await MemberService.authenticate(email, password);
      const session = await AuthService.create(String(member.id));
      response.cookie('avto_session', session.token, { httpOnly: true, secure: request.secure, sameSite: 'lax', maxAge: 7 * 86400000, path: '/' });
      response.json({ success: true, data: { member, token: session.token } });
    } catch (error) { next(error); }
  }
  static async logout(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      requestLanguage(request);
      const sessionId = (request as Request & { sessionId?: string }).sessionId;
      if (sessionId) await AuthService.revoke(sessionId);
      response.clearCookie('avto_session', { httpOnly: true, sameSite: 'lax', path: '/' });
      response.json({ success: true });
    } catch (error) { next(error); }
  }
  static async profile(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      requestLanguage(request);
      const memberId = (request as Request & { memberId?: string }).memberId;
      if (!memberId) throw new AppError('UNAUTHORIZED', 401);
      response.json({ success: true, data: await MemberService.getProfile(memberId) });
    } catch (error) { next(error); }
  }
}
