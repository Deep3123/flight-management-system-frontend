export const environment_prod = {
  production: true,
  encryption: {
    secretKey: "${ENCRYPTION_SECRET_KEY}",
    iv: "${ENCRYPTION_IV}",
  },
};
