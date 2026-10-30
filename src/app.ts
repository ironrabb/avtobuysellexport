import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import memberRoutes from './routes/member.routes';
import carRoutes from './routes/car.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler, AppError } from './libs/utils/Errors';

const app = express();
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: { directives: { ...helmet.contentSecurityPolicy.getDefaultDirectives(), 'script-src': ["'self'", "'unsafe-inline'"], 'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'], 'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'], 'img-src': ["'self'", 'data:', 'https://images.unsplash.com'] } } }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(cookieParser());
app.use('/public', express.static(path.resolve(process.cwd(), 'src/public')));
app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), 'src/views'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 200, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/health', (_request, response) => response.json({ success: true, status: 'ok' }));
app.use('/api/members', memberRoutes);
app.use('/api/cars', carRoutes);
app.use('/admin', adminRoutes);
// Ishlab chiqarishda Vite build fayllarini shu Express server orqali tarqatamiz.
const frontendBuild = path.resolve(process.cwd(), 'frontend/dist');
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  app.get('*', (request, response, next) => {
    if (request.path.startsWith('/api/') || request.path.startsWith('/admin/')) return next(new AppError('NOT_FOUND', 404));
    response.sendFile(path.join(frontendBuild, 'index.html'));
  });
}
app.use((_request, _response, next) => next(new AppError('NOT_FOUND', 404)));
app.use(errorHandler);

export default app;
