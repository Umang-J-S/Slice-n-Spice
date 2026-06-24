import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel';
import { AuthService } from '../modules/auth/services/authService';

console.log("PASSPORT INIT CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
      callbackURL: process.env.CALLBACK_URL || 'http://localhost:5000/api/v1/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await AuthService.findOrCreateGoogleUser(profile);

        // Validate user's role against allowed roles
        const isAuthorized = AuthService.validateUserRole(user.role);
        if (!isAuthorized) {
          return done(null, false, {
            message: `Access denied. Role '${user.role}' is not authorized to log in.`,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
