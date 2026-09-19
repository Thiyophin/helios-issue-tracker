import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import User from '../models/User.js';
import logger from '../utils/logger.js';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.userId).select('-password');

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      logger.error('Passport JWT authentication error', {
        message: error.message,
        stack: error.stack,
      });

      return done(error, false);
    }
  }),
);

export default passport;
