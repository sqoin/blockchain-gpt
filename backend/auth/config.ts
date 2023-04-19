import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import Dashboard from "supertokens-node/recipe/dashboard";

import * as dotenv from "dotenv";
import * as path from "path";

const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, "./.env") });

export function getApiDomain() {
  const apiPort = process.env.REACT_APP_API_PORT || 3001;
  const apiUrl = process.env.REACT_APP_API_URL || `http://localhost:${apiPort}`;
  return apiUrl;
}

export function getWebsiteDomain() {
  const websitePort = process.env.REACT_APP_WEBSITE_PORT || 3000;
  const websiteUrl =
    process.env.REACT_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
  return websiteUrl;
}

export const SuperTokensConfig: TypeInput = {
  framework: "express",
  supertokens: {
    // this is the location of the SuperTokens core.
    connectionURI: String(process.env.URI),
    apiKey: String(process.env.KEY),
  },
  appInfo: {
    appName: "Blockcahin Terminal",
    apiDomain: getApiDomain(),
    websiteDomain: getWebsiteDomain(),
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  // recipeList contains all the modules that you want to
  recipeList: [
    ThirdPartyEmailPassword.init({
      providers: [
        ThirdPartyEmailPassword.Google({
          clientId: String(process.env.CLIENT_ID),
          clientSecret: String(process.env.CLIENT_SECRET),
        }),
        ThirdPartyEmailPassword.Github({
          clientSecret: String(process.env.GITHUB_CLIENT),
          clientId: String(process.env.GITHUB_SECRET),
        }),
      ],
    }),
    Dashboard.init(),
    Session.init(),
  ],
};
