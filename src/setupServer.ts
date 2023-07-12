import {Application, json, urlencoded, Response, Request, Next} from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession  from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';


export class ChattyServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);

  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: ['test1', 'test2'],
        // set the max age to 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: false,
      })
    );

    app.use(hpp());
    app.use(helmet());
    app.use(cors({
      origin: '*',
      credentials: true,
      optionsSuccessStatus: HTTP_STATUS.OK,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }));
  }

  private standardMiddleware(app: Application): void {
  }

  private routeMiddleware(app: Application): void {
  }

  private globalErrorHandler(app: Application): void {
  }

  private startServer(app: Application): void {
  }

  private createSocketIO(httpServer: http.Server): void {
  }

  private startHttpServer(httpServer: http.Server): void {
  }



}