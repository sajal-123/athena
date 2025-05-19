import { Request, Response, NextFunction, RequestHandler } from 'express';

const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      console.error(error);

      res.status(error.code || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  };
};

export { asyncHandler };
