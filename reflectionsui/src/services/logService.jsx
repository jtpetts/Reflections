import * as Sentry from "@sentry/browser";
import env from "../env";

function init() {
  Sentry.init({
    dsn: env.reflectionsSentryDSN()
  });
}

function log(error) {
  Sentry.captureException(error);
}

//SENTRY_DSN environment variable
//$ npm install @sentry/browser@4.3.0
// Sentry.captureException(err);
export default {
  init,
  log
};
