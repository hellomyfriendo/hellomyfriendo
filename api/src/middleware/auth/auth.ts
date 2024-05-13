import {Request, Response, NextFunction} from 'express';
import {OAuth2Client} from 'google-auth-library';
import {UnauthorizedError} from '../../errors';
import { AuthArgs } from './interfaces';


class Auth {
    private readonly oAuth2Client: OAuth2Client;
    private readonly oAuth2ClientID: string;

  constructor(private readonly args: AuthArgs) {
    this.oAuth2Client = args.oAuth2Client;
    this.oAuth2ClientID = args.oAuth2ClientID;
  }

  requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = this.getToken(req);

      if (!token) {
        throw new UnauthorizedError(
          '"Bearer" token is required in "Authorization" header'
        );
      }

      const tokenPayload = await this.verify(token);

      if (!tokenPayload) {
        throw new UnauthorizedError("Couldn't get the token's payload");
      }

      req.user = {
        id: tokenPayload.sub
      };

      return next();
    } catch (err) {
      return next(err);
    }
  };

  optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = this.getToken(req);

      if (!token) {
        return next();
      }

      const tokenPayload = await this.verify(token);

      if (!tokenPayload) {
        throw new UnauthorizedError("Couldn't get the token's payload");
      }

      req.user = {
        id: tokenPayload.sub
      };

      return next();
    } catch (err) {
      return next(err);
    }
  };

  private getToken = (req: Request) => {
    const authorizationHeader = req.header('Authorization') || req.header('authorization');

    if (!authorizationHeader) {
      return;
    }

    const token = authorizationHeader.split('Bearer ')[1];

    return token;
  };

  private async verify(idToken: string) {
    const ticket = await this.oAuth2Client.verifyIdToken({
      idToken,
      audience: this.oAuth2ClientID,
    });

    return ticket.getPayload();
  }
}

export {Auth};