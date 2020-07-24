import {ApplicationConfig, ExpressServer} from './server';

export * from './server';

/**
 * Prepare server config
 * @param oauth2Providers
 */
export async function serverConfig(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oauth2Providers: any,
): Promise<ApplicationConfig> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      protocol: 'http',
      gracePeriodForClose: 5000, // 5 seconds
      cors: {
        origin: 'http://localhost:4000',
        credentials: true,
      },
      openApiSpec: {
        setServersFromRequest: true,
      },
      // Use the LB4 application as a route. It should not be listening.
      listenOnStart: false,
    },

    facebookOptions: oauth2Providers['facebook-login'],
    googleOptions: oauth2Providers['google-login'],
    oauth2Options: oauth2Providers['oauth2'],
  };
  return config;
}

/**
 * Start this application
 * @param oauth2Providers
 */
export async function startApplication(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oauth2Providers: any,
): Promise<ExpressServer> {
  const config = await serverConfig(oauth2Providers);
  const server = new ExpressServer(config);
  await server.boot();
  await server.start();
  return server;
}

/**
 * run main() to start application with oauth config
 */
export async function main() {
  let oauth2Providers;
  if (process.env.OAUTH_PROVIDERS_LOCATION) {
    oauth2Providers = require(process.env.OAUTH_PROVIDERS_LOCATION);
  } else {
    oauth2Providers = require('../oauth2-providers.json');
  }
  const server: ExpressServer = await startApplication(
    oauth2Providers, // eg: export DB_BKP_FILE_PATH=../data/db.json
  );
  console.log(`Server is running at ${server.url}`);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
