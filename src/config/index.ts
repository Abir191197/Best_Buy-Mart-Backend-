import dotenv from "dotenv";
dotenv.config();

export default {
  //DATABASE_URL: process.env.DATABASE_URL,
  port: process.env.port,
  JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN,
  JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN,

  ACCESS_TOKEN_EXPIRED: process.env.ACCESS_TOKEN_EXPIRED,
  REFRESH_TOKEN_EXPIRED: process.env.REFRESH_TOKEN_EXPIRED,
  NODE_ENV: process.env.NODE_ENV,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_USERNAME: process.env.MAIL_USERNAME,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  STORE_ID: process.env.store_id,
  STORE_SECRET: process.env.store_passwd,
  STORE_URL: process.env.store_url,
  PAYMENT_VALIDATION_URL: process.env.validation_url,
  PAYMENT_IPN_URL: process.env.PAYMENT_IPN,
  is_live: process.env.is_live,
  PAYMENT_SUCCESS_URL: process.env.PAYMENT_SUCCESS_URL,
  PAYMENT_FAIL_URL: process.env.PAYMENT_FAIL_URL,
  PAYMENT_CANCEL_URL: process.env.PAYMENT_CANCEL_URL,
  AWS_SECRET_ACCESS_KEY: process.env.Secret_key,
  AWS_ACCESS_KEY: process.env.Access_key,
};
