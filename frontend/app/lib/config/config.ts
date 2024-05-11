import Joi from "joi";

const envVarsSchema = Joi.object()
  .keys({
    AUTH0_BASE_URL: Joi.string().uri().required(),
    AUTH0_CLIENT_ID: Joi.string().required(),
    AUTH0_CLIENT_SECRET: Joi.string().required(),
    AUTH0_ISSUER_BASE_URL: Joi.string().uri().required(),
    AUTH0_SECRET: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw error;
}

const config = {
  auth0: {
    baseUrl: envVars.AUTH0_BASE_URL,
    clientID: envVars.AUTH0_CLIENT_ID,
    clientSecret: envVars.AUTH0_CLIENT_SECRET,
    issuerBaseUrl: envVars.AUTH0_ISSUER_BASE_URL,
    secret: envVars.AUTH0_SECRET,
  },
};

export { config };
