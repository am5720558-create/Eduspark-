import dotenv from "dotenv";
dotenv.config();

export const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  DATABASE_URL: process.env.DATABASE_URL || "file:./prisma/dev.db",
  PERSISTENCE: process.env.PERSISTENCE || "sqlite",
  ENABLE_BROWSING: process.env.ENABLE_BROWSING === "true",
  ENABLE_VISION: process.env.ENABLE_VISION === "true",
  ENABLE_TTI: process.env.ENABLE_TTI === "true",
  ENABLE_TTS: process.env.ENABLE_TTS !== "false",
  ENABLE_STT: process.env.ENABLE_STT !== "false",
  PORT: parseInt(process.env.PORT || "8787")
};
