export const AUTH_CONFIG = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
  isConfigured: () => Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD)
};
