import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../models/Auth.service';
import { MemberService } from '../../models/Member.service';
import { AppError } from './Errors';

export async function requireAuth(request: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const header = request.get('authorization');
    const token = header?.startsWith('Bearer ') ? header.slice(7) : request.cookies?.avto_session;
    if (!token) throw new AppError('UNAUTHORIZED', 401);
    const identity = await AuthService.verify(token);
    Object.assign(request, { memberId: identity.memberId, sessionId: identity.sessionId });
    next();
  } catch (error) { next(error); }
}

export async function requireAdmin(request: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const token = request.cookies?.avto_session as string | undefined;
    if (!token) throw new AppError('UNAUTHORIZED', 401);
    const identity = await AuthService.verify(token);
    if (!(await MemberService.isActiveAdmin(identity.memberId))) throw new AppError('FORBIDDEN', 403);
    next();
  } catch (error) { next(error); }
}

export async function requireSeller(request: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const header = request.get('authorization');
    const token = header?.startsWith('Bearer ') ? header.slice(7) : request.cookies?.avto_session;
    if (!token) throw new AppError('UNAUTHORIZED', 401);
    const identity = await AuthService.verify(token);
    if (!(await MemberService.isActiveSeller(identity.memberId))) throw new AppError('FORBIDDEN', 403);
    Object.assign(request, { memberId: identity.memberId, sessionId: identity.sessionId });
    next();
  } catch (error) { next(error); }
}
