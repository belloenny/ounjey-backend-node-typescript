import {ApplicationConfig} from '@loopback/core';
import bodyParser from 'body-parser';
import session from 'client-sessions';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import {once} from 'events';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import {AddressInfo} from 'net';
import {OunjeyApp} from './application';
export {ApplicationConfig};

/**
 * An express server with multiple apps
 */
export class ExpressServer {
  public app: express.Application;
  public readonly lbApp: OunjeyApp;
  private server?: http.Server;
  public url: String;

  constructor(options: ApplicationConfig = {}) {
    // Express Web App
    this.app = express();
    // LB4 App
    this.lbApp = new OunjeyApp(options);

    this.initializeSecurity();

    this.initializeMiddlewares();

    /**
     * bind the oauth2 options to lb app
     *
     */
    this.lbApp.bind('facebookOAuth2Options').to(options.facebookOptions);
    this.lbApp.bind('googleOAuth2Options').to(options.googleOptions);
    this.lbApp.bind('customOAuth2Options').to(options.oauth2Options);
    /**
     * Mount the LB4 app router in / path
     */
    this.app.use('/', this.lbApp.requestHandler);
  }

  public async boot() {
    await this.lbApp.boot();
  }

  /**
   * Adds security middleware to app
   */
  private initializeSecurity() {
    this.app.use(helmet.frameguard());
    this.app.use(helmet.hsts());
    this.app.use(helmet.ieNoOpen());
    this.app.use(helmet.noSniff());
    this.app.use(helmet.xssFilter());
  }

  /**
   * Adds desired middleware to app
   */
  private initializeMiddlewares() {
    this.app.use('parse', bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(compression());
    this.app.use(
      session({
        cookieName: 'session',
        secret: 'random_string_goes_here',
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
      }),
    );
  }

  /**
   * Start the express app and the lb4 app
   */
  public async start() {
    await this.lbApp.start();
    const port = this.lbApp.restServer.config.port ?? 3000;
    const host = this.lbApp.restServer.config.host ?? 'localhost';
    this.server = this.app.listen(port, host);
    await once(this.server, 'listening');
    const add = <AddressInfo>this.server.address();
    this.url = `http://${add.address}:${add.port}`;
  }

  /**
   * Stop lb4 and express apps
   */
  public async stop() {
    if (!this.server) return;
    await this.lbApp.stop();
    this.server.close();
    await once(this.server, 'close');
    this.server = undefined;
  }
}
