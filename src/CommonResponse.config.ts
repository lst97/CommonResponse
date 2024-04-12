import { Containers } from "./inversify.config";

export class Config {
  private static _instance: Config;

  public static get instance() {
    if (!Config._instance) {
      Config._instance = new Config();
    }
    return Config._instance;
  }

  public set traceIdIdentifier(value: string) {
    Containers.instance.traceIdIdentifier = value;
  }

  public get traceIdIdentifier() {
    return Containers.instance.traceIdIdentifier;
  }
}
