import {Application, json, urlencoded, Response, Request, NextFunction} from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession  from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';
import {config} from './config';
import {Server} from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import routes from './routes';
import { CustomError, IErrorResponse } from './shared/globals/helpers/error-handler';
import Logger from 'bunyan';
 

const SERVER_PORT = 8080;
const log: Logger = config.createLogger('server');

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
        keys: [config.SESSION_KEY_1, config.SESSION_KEY_2],
        // set the max age to 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV === 'development' ? false : true,
      })
    );

    app.use(hpp());
    app.use(helmet());
    app.use(cors({
      origin: config.CLIENT_URL,
      credentials: true,
      optionsSuccessStatus: HTTP_STATUS.OK,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
    routes(app);
  }

  private globalErrorHandler(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Route not found',
      });
    });

    app.use((err: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      log.error(err);
      if (err instanceof CustomError) {
        return res.status(err.statusCode).json(err.serializeErrors());
      }
    })
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer = http.createServer(app);
      const io = await this.createSocketIO(httpServer);
      // start http server and socket.io connections
      this.startHttpServer(httpServer);
      this.socketIOConnections(io);
      
    } catch (err) {
      log.error(err);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      }
    });
    const pubClient = createClient({url: config.REDIS_HOST});
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private socketIOConnections(io: Server): void {
  }

  private startHttpServer(httpServer: http.Server): void {
    log.info(`server started with process id ${process.pid}`);
    httpServer.listen(process.env.PORT || SERVER_PORT, () => {
      log.info(`Server is listening on port ${process.env.PORT || SERVER_PORT}`);
    });
  }



}