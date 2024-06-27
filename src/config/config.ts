import { config as conf } from "dotenv";

conf();
const _config = {
  port: process.env.PORT,
  dataBaseURL: process.env.DB_CONNECTION_URL,
  env: process.env.NODE_ENV,
  jwt_secret: process.env.JWT_SECRET,
  cloudinary_name : process.env.CLOUDINARY_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_secret_key: process.env.CLOUDINARY_SECRECT_KEY
};

export const config = Object.freeze(_config);
