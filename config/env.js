import 'dotenv/config';
import { cleanEnv, str, port } from 'envalid';

const env = cleanEnv(process.env, {
  MONGO_URI: str(),
  JWT_SECRET: str({ minLength: 32 }),
  JWT_EXPIRES_IN: str(),

  PORT: port({ default: 5000 }),

  ADMIN_USERNAME: str(),
  ADMIN_NAME: str(),
  ADMIN_EMAIL: str(),
  ADMIN_PASSWORD: str(),
});

export default {
  mongoUri: env.MONGO_URI,
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  port: env.PORT,

  adminUsername: env.ADMIN_USERNAME,
  adminName: env.ADMIN_NAME,
  adminEmail: env.ADMIN_EMAIL,
  adminPassword: env.ADMIN_PASSWORD,
};
