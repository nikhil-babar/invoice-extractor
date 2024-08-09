import joi from "joi";
import { config } from "dotenv";

config({
  path: ".env",
  debug: true,
});

const envSchema = joi.object({
  PORT: joi.number().integer(),
  GEMINI_API_KEY: joi.string(),
  MONGO_URL: joi.string(),
  MONGO_DB_NAME: joi.string(),
});

export interface Env {
  PORT: number;
  GEMINI_API_KEY: string;
  MONGO_URL: string;
  MONGO_DB_NAME: string;
}

function getEnv(): Env {
  const parsed = envSchema.validate(process.env);
  return parsed.value;
}

export default getEnv;
