import type { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncHandler = (
  req : Request,
  res : Response,
  next: NextFunction
) => Promise<unknown>;

export default function wrapAsync(fn : AsyncHandler): RequestHandler{
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};