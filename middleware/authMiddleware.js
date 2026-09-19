import passport from '../config/passport.js';

const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).json({
        message: 'Invalid or expired token',
      });
    }

    req.user = user;

    next();
  })(req, res, next);
};

export default authenticate;
