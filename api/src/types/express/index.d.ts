import * as lb from '@google-cloud/logging-bunyan';
import { User } from '../../users';

export {};

declare global {
  namespace Express {
    export interface Request {
      log: lb.express.Logger;
      user?: User
    }
  }
}
