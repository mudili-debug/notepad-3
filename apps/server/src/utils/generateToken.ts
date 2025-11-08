import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string, secret: string): any => {
  return jwt.verify(token, secret);
};
