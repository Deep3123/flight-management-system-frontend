export const environment = {
  production: true,
  encryption: {
    secretKey: "${ENCRYPTION_SECRET_KEY}",
    iv: "${ENCRYPTION_IV}",
  },
};
