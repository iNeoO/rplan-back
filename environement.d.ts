declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      EMAIL_HOST: string;
      EMAIL_PORT: string;
      EMAIL_AUTH_USER: string;
      EMAIL_AUTH_PASS: string;
      SALT_ROUNDS: string;
      AUTH_SECRET_KEY: string;
      PASSWORD_FORGOTTEN_SECRET_KEY: string;
      EMAIL_VALIDATION_SECRET_KEY: string;
      TOKEN_PASSWORD_FORGOTTEN_EXPIRATION: string;
      COOKIE_NAME: string;
      COOKIE_BIS_NAME: string;
      COOKIE_EXPIRATION: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
