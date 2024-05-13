"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const celebrate_1 = require("celebrate");
const envVarsSchema = celebrate_1.Joi.object()
    .keys({
    GOOGLE_CLOUD_PROJECT_ID: celebrate_1.Joi.string().required(),
    GOOGLE_IDENTITY_OAUTH2_CLIENT_ID: celebrate_1.Joi.string().required(),
    GOOGLE_MAPS_API_KEY: celebrate_1.Joi.string().required(),
    K_REVISION: celebrate_1.Joi.string().required(),
    K_SERVICE: celebrate_1.Joi.string().required(),
    LOG_LEVEL: celebrate_1.Joi.string().valid('debug', 'info').default('info'),
    PGDATABASE: celebrate_1.Joi.string().required(),
    PGHOST: celebrate_1.Joi.string().required(),
    PGPASSWORD: celebrate_1.Joi.string().required(),
    PGPORT: celebrate_1.Joi.number().integer().required(),
    PGUSERNAME: celebrate_1.Joi.string().required(),
    PORT: celebrate_1.Joi.number().integer().required(),
})
    .unknown();
const { value: envVars, error } = envVarsSchema.validate(process.env);
if (error) {
    throw error;
}
const config = {
    google: {
        maps: {
            apiKey: envVars.GOOGLE_MAPS_API_KEY,
        },
        identity: {
            oAuth2: {
                clientID: envVars.GOOGLE_IDENTITY_OAUTH2_CLIENT_ID
            }
        },
        cloud: {
            project: {
                id: envVars.GOOGLE_CLOUD_PROJECT_ID,
            },
        },
    },
    logLevel: envVars.LOG_LEVEL,
    pg: {
        database: envVars.PGDATABASE,
        host: envVars.PGHOST,
        password: envVars.PGPASSWORD,
        port: envVars.PGPORT,
        username: envVars.PGUSERNAME,
    },
    port: envVars.PORT,
    service: {
        name: envVars.K_SERVICE,
        version: envVars.K_REVISION,
    },
};
exports.config = config;
//# sourceMappingURL=config.js.map