// Read from process.env
const env = {
  //Server
  PORT: Number(process.env.PORT) || 3000,
  HOST: process.env.HOST || '0.0.0.0',

  //Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/attendance',

  //JWT
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret',

  //TOTP
  TOTP_WINDOW: Number(process.env.TOTP_WINDOW) || 1,
  TOTP_STEP_SECONDS: Number(process.env.TOTP_STEP_SECONDS) || 30,
} as const

export { env }
