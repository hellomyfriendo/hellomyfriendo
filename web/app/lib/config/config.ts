import Joi from "joi";

const envVarsSchema = Joi.object()
  .keys({
    GOOGLE_IDENTITY_OAUTH2_CLIENT_ID: Joi.string().required(),
    GOOGLE_IDENTITY_OAUTH2_CLIENT_SECRET: Joi.string().required(),
    NEXT_AUTH_SECRET: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw error;
}

const config = {
  google: {
    identity: {
      oAuth2: {
        clientID: envVars.GOOGLE_IDENTITY_OAUTH2_CLIENT_ID,
        clientSecret: envVars.GOOGLE_IDENTITY_OAUTH2_CLIENT_SECRET,
      },
    },
  },
  nextAuth: {
    secret: envVars.NEXT_AUTH_SECRET,
  },
};

export { config };
