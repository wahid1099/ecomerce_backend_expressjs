import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  backend_url: process.env.BACKEND_URL,
  payment_verify_url: process.env.PAYMENT_VERIFY_URL,
  payment_url: process.env.PAYMENT_URL,
  store_id: process.env.STORE_ID,
  signature_key: process.env.SIGNATURE_KEY,
  client_url: process.env.CLIENT_URL,

  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_pass_secret: process.env.RESET_PASS_TOKEN,
    reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
  },
  reset_pass_link: process.env.RESET_PASS_LINK,
  emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
  // ssl: {
  //   storeId: process.env.STORE_ID,
  //   storePass: process.env.STORE_PASS,
  //   successUrl: process.env.SUCCESS_URL,
  //   cancelUrl: process.env.CANCEL_URL,
  //   failUrl: process.env.FAIL_URL,
  //   sslPaymentApi: process.env.SSL_PAYMENT_API,
  //   sslValidationApi: process.env.SSL_VALIDATIOIN_API,
  // },
};
