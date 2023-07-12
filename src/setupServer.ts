import {Application, json, urlencoded, Response, Request, Next} from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession  from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';


const SERVER_PORT = 5000;

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
    app.use(compression());
    // set the limit of the request body to 50mb
    app.use(json({
      limit: '50mb',
    }));

    app.use(urlencoded({
      limit: '50mb',
      extended: true,
    }));

  }

  private routeMiddleware(app: Application): void {
  }

  private globalErrorHandler(app: Application): void {
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer = http.createServer(app);
      this.startHttpServer(httpServer);
    } catch (err) {
      console.error(err);
    }
  }

  private createSocketIO(httpServer: http.Server): void {
  }

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(process.env.PORT || SERVER_PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT || SERVER_PORT}`);
    });
  }



}