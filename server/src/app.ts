import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import { notFound, errorHandler } from './middlewares/errorMiddleware';
import { buildApiRouter } from './routes';
import { sessionStore } from './services/redis';
import './services/passport';

const app: Express = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Session middleware configuration is handled by redisService

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Session middleware configuration
app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'some_dummy_session_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
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
