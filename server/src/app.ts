import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { notFound, errorHandler } from './middlewares/errorMiddleware';
import { buildApiRouter } from './routes';
import { sessionStore } from './services/redis';
import './services/passport';

const app: Express = express();

// TODO: Remove this compression middleware when moving to real production on Amazon EC2 / NGINX
// as NGINX handles compression much more efficiently. Keep for Render testing.
app.use(compression());

// Security middlewares
app.use(helmet());
// Optional: Configure helmet to allow images from other domains if you are using Cloudinary or similar
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

app.use(express.urlencoded({ extended: true }));
app.use(hpp());

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Session middleware configuration is handled by redisService

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl requests) or allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Session middleware configuration
const memoryStore = new session.MemoryStore();

app.use(
  session({
    store: sessionStore || memoryStore,
    secret: process.env.SESSION_SECRET || 'some_dummy_session_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/v1', buildApiRouter());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Server!');
});

app.use(notFound);
app.use(errorHandler);

export default app;
