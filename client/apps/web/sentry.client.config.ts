// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

function configureSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_ENABLED !== 'true') {
    return
  }

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1,
    debug: process.env.NODE_ENV !== 'production',
    environment: process.env.NODE_ENV,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    integrations: [
      Sentry.replayIntegration({
        // Additional Replay configuration goes in here, for example:
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    enabled: process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true',
  });
}

configureSentry();
