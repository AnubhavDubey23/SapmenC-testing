import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 30,
    message: "Ran out of attempts. Please try again later.",
});