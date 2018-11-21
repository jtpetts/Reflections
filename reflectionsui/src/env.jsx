function reflectionsApiUrl() {
  return process.env.REACT_APP_REFLECTIONS_API;
}

function reflectionsSentryDSN() {
  return process.env.REACT_SENTRY_DSN;
}

export default { reflectionsApiUrl, reflectionsSentryDSN };
