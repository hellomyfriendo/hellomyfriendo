"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express = require("express");
const cors = require("cors");
const helmet_1 = require("helmet");
const lb = require("@google-cloud/logging-bunyan");
const language_1 = require("@google-cloud/language");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const db_1 = require("./db");
const middleware_1 = require("./middleware");
const health_check_1 = require("./health-check");
const wants_1 = require("./wants");
const error_handler_1 = require("./error-handler");
const config_1 = require("./config");
const google_auth_library_1 = require("google-auth-library");
async function createApp() {
    await db_1.db.migrate.latest();
    const { logger, mw } = await lb.express.middleware({
        level: config_1.config.logLevel,
        logName: config_1.config.service.name,
        projectId: config_1.config.google.cloud.project.id,
        redirectToStdout: true,
        serviceContext: {
            service: config_1.config.service.name,
            version: config_1.config.service.version,
        },
        skipParentEntryForCloudRun: true,
    });
    const googleLanguageServiceClient = new language_1.LanguageServiceClient({
        projectId: config_1.config.google.cloud.project.id,
    });
    const googleMapsServiceClient = new google_maps_services_js_1.Client();
    const oAuth2Client = new google_auth_library_1.OAuth2Client({
        project_id: config_1.config.google.cloud.project.id
    });
    const auth = new middleware_1.Auth({
        oAuth2Client,
        oAuth2ClientID: config_1.config.google.identity.oAuth2.clientID,
    });
    const wantsService = new wants_1.WantsService({
        db: db_1.db,
        googleCloud: {
            language: {
                serviceClient: googleLanguageServiceClient,
            },
            maps: {
                serviceClient: googleMapsServiceClient,
                apiKey: config_1.config.google.maps.apiKey,
            },
        },
        logger,
    });
    const healthCheckRouter = new health_check_1.HealthCheckRouter().router;
    const wantsRouter = new wants_1.WantsRouter({
        auth,
        wantsService,
    }).router;
    const app = express();
    app.use(mw);
    app.use(cors());
    app.use((0, helmet_1.default)());
    app.use(express.json());
    app.use('/healthz', healthCheckRouter);
    app.use('/wants', wantsRouter);
    app.use(async (err, req, res, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next) => {
        await error_handler_1.errorHandler.handleError(err, req, res);
    });
    return { app, logger };
}
exports.createApp = createApp;
//# sourceMappingURL=app.js.map