import { Request, Response } from 'express';
declare class ErrorHandler {
    handleError(err: Error, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
export declare const errorHandler: ErrorHandler;
export {};
