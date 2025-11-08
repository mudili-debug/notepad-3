import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map((e: any) => e.message),
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({ message: 'Invalid ID format' });
    return;
  }

  if (err.code === 11000) {
    res.status(400).json({ message: 'Duplicate field value' });
    return;
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
