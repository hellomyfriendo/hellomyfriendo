import * as express from 'express';
import * as cors from 'cors';
import helmet from 'helmet';
import * as lb from '@google-cloud/logging-bunyan';
import {LanguageServiceClient} from '@google-cloud/language';
import {Client as GoogleMapsServicesClient} from '@googlemaps/google-maps-services-js';
import {db} from './db';
import {Auth} from './middleware'
import {HealthCheckRouter} from './health-check';
import {WantsRouter, WantsService} from './wants';
import {errorHandler} from './error-handler';
import {config} from './config';
import { OAuth2Client } from 'google-auth-library';

async function createApp() {
  await db.migrate.latest();

  const {logger, mw} = await lb.express.middleware({
    level: config.logLevel,
    logName: config.service.name,
    projectId: config.google.cloud.project.id,
    redirectToStdout: true,
    serviceContext: {
      service: config.service.name,
      version: config.service.version,
    },
    skipParentEntryForCloudRun: true,
  });

  const googleLanguageServiceClient = new LanguageServiceClient({
    projectId: config.google.cloud.project.id,
  });

  const googleMapsServiceClient = new GoogleMapsServicesClient();

  const oAuth2Client = new OAuth2Client({
    project_id: config.google.cloud.project.id
  })

  const auth = new Auth({
    oAuth2Client,
    oAuth2ClientID: config.google.identity.oAuth2.clientID,
  })

  const wantsService = new WantsService({
    db,
    googleCloud: {
      language: {
        serviceClient: googleLanguageServiceClient,
      },
      maps: {
        serviceClient: googleMapsServiceClient,
        apiKey: config.google.maps.apiKey,
      },
    },
    logger,
  });

  const healthCheckRouter = new HealthCheckRouter().router;

  const wantsRouter = new WantsRouter({
    auth,
    wantsService,
  }).router;

  const app = express();

  app.use(mw);

  app.use(cors());

  app.use(helmet());

  app.use(express.json());

  app.use('/healthz', healthCheckRouter);

  app.use('/wants', wantsRouter);

  app.use(
    async (
      err: Error,
      req: express.Request,
      res: express.Response,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _next: express.NextFunction
    ) => {
      await errorHandler.handleError(err, req, res);
    }
  );

  return {app, logger};
}

export {createApp};
