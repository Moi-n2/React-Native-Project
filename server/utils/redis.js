import { Redis } from "ioredis";
import "dotenv/config";

const redisClient = () => {
  if (process.env.REDIS_URI) {
    return process.env.REDIS_URI;
  }
  throw new Error("Redis connection failed");
};

export const redis = new Redis(redisClient());
