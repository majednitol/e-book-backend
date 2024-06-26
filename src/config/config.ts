import { config as conf } from "dotenv";
conf();
const _config = {
  port: process.env.PORT,
  dataBaseURL: process.env.DB_CONNECTION_URL,
  env: process.env.NODE_ENV,
  jwt_secret: process.env.JWT_SECRET,
};

export const config = Object.freeze(_config);
