import { Request, Response, NextFunction } from 'express';
import { AuthArgs } from './interfaces';
declare class Auth {
    private readonly args;
    private readonly oAuth2Client;
    private readonly oAuth2ClientID;
    constructor(args: AuthArgs);
    requireAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    private getToken;
    private verify;
}
export { Auth };
