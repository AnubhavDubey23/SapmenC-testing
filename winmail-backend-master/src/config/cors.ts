import cors from 'cors';

export const VALID_CORS = ['http://localhost:3000', 'https://app.mailerone.in'];

export const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (VALID_CORS.indexOf(origin!) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
