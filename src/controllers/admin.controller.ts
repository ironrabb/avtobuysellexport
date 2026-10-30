import type { Request, Response, NextFunction } from 'express';
import { CarService } from '../models/Car.service';
import { AppError, requestLanguage } from '../libs/utils/Errors';
import { CarStatus } from '../libs/enums/car.enum';
import { MemberService } from '../models/Member.service';
import { AuthService } from '../models/Auth.service';

export class AdminController {
  static async loginForm(_request: Request, response: Response, next: NextFunction): Promise<void> {
    try { response.render('admin/login', { title: 'Admin kirish', error: null }); }
    catch (error) { next(error); }
  }
  static async login(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      requestLanguage(request);
      const { email, password } = request.body ?? {};
      if (typeof email !== 'string' || typeof password !== 'string') throw new AppError('VALIDATION', 400);
      const member = await MemberService.authenticate(email, password);
      if (!(await MemberService.isActiveAdmin(String(member.id)))) throw new AppError('FORBIDDEN', 403);
      const session = await AuthService.create(String(member.id));
      response.cookie('avto_session', session.token, { httpOnly: true, secure: request.secure, sameSite: 'lax', maxAge: 7 * 86400000, path: '/' });
      response.redirect('/admin/cars');
    } catch (error) { next(error); }
  }
  static async dashboard(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      requestLanguage(request);
      const cars = await CarService.listForAdmin();
      response.render('admin/cars', { cars, title: 'E’lonlarni boshqarish' });
    } catch (error) { next(error); }
  }
  static async moderate(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      requestLanguage(request);
      if (request.body.action !== 'approve' && request.body.action !== 'reject') throw new AppError('VALIDATION', 400);
      const status = request.body.action === 'approve' ? CarStatus.ACTIVE : CarStatus.REJECTED;
      await CarService.moderate(request.params.id, status);
      response.redirect('/admin/cars');
    } catch (error) { next(error); }
  }
}
