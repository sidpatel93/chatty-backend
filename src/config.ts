import dotenv from 'dotenv';
import bunyan from 'bunyan';

dotenv.config({});

class Config {

  public DATABASE_URL: string;
  public JWT_TOKEN: string;
  public NODE_ENV: string;
  public SESSION_KEY_1: string;
  public SESSION_KEY_2: string;
  public CLIENT_URL: string;
  public REDIS_HOST: string;

  private readonly _DATABASE_URL = 'mongodb://localhost:27017/chattyapp-backend';
  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this._DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SESSION_KEY_1 = process.env.SESSION_KEY_1 || '';
    this.SESSION_KEY_2 = process.env.SESSION_KEY_2 || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Missing config key: ${key}`);
      }
    }
  }
}

export const config = new Config();