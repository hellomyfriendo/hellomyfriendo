import { initAuth0 as nextjsInitAuth0 } from "@auth0/nextjs-auth0";
import { config } from "../config";

const initAuth0 = nextjsInitAuth0({
  baseURL: config.auth0.baseUrl,
  clientID: config.auth0.clientID,
  clientSecret: config.auth0.clientSecret,
  issuerBaseURL: config.auth0.issuerBaseUrl,
  secret: config.auth0.secret,
});

export { initAuth0 };
