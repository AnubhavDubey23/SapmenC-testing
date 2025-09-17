import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 10000, // 10 seconds
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default limiter;
