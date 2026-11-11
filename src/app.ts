import express from "express";
import path from "node:path";
import fs from "node:fs";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import memberRoutes from "./routes/member.routes";
import carRoutes from "./routes/car.routes";
import adminRoutes from "./routes/admin.routes";
import { errorHandler, AppError, HttpCode } from "./libs/utils/Errors";
import { MORGAN_FORMAT } from "./libs/utils/config";

const app = express();
app.use(morgan(MORGAN_FORMAT));

/** 1. ENTRANCE: asosiy xavfsizlik va kiruvchi so'rov parserlari */
app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
        "img-src": ["'self'", "data:", "https://images.unsplash.com"],
      },
    },
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

/** 2. SESSION: JWT session cookie'larini o'qish.
 * Session yozuvlarini AuthService MongoDB'da tekshiradi.
 */
app.use(cookieParser());

/** 3. MIDDLEWARE: static fayllar, API rate limit va health endpoint */
app.use("/public", express.static(path.resolve(process.cwd(), "src/public")));
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);
app.get("/health", (_request, response) =>
  response.status(HttpCode.OK).json({ success: true, status: "ok" }),
);

/** 4. VIEWS: admin sahifalarini EJS bilan render qilish */
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/views"));

/** 5. ROUTERS: admin va API yo'llari */
app.use("/admin", adminRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/cars", carRoutes);

// Ishlab chiqarishda Vite build fayllarini Express orqali tarqatamiz.
const frontendBuild = path.resolve(process.cwd(), "frontend/dist");
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  app.get("*", (request, response, next) => {
    const isBackendPath = ["/api", "/admin"].some(
      (routePrefix) =>
        request.path === routePrefix ||
        request.path.startsWith(`${routePrefix}/`),
    );
    if (isBackendPath) return next(new AppError("NOT_FOUND", HttpCode.NOT_FOUND));
    response.sendFile(path.join(frontendBuild, "index.html"));
  });
}

app.use((_request, _response, next) => next(new AppError("NOT_FOUND", HttpCode.NOT_FOUND)));
app.use(errorHandler);

export default app;
