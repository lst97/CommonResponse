import { Config as ResponseStructureConfig } from "@lst97/common-response-structure";

export class Config {
  private static _instance: Config;
  private _idIdentifier: string = "unknown";
  private _requestIdName: string = "requestId";
  private _traceIdName: string = "traceId";

  private constructor() {}

  public static get instance() {
    if (!Config._instance) {
      // Set for Schemas rules
      ResponseStructureConfig.instance.requestIdName = "requestId";
      ResponseStructureConfig.instance.traceIdName = "traceId";
      Config._instance = new Config();
    }
    return Config._instance;
  }

  public set idIdentifier(value: string) {
    ResponseStructureConfig.instance.idIdentifier = value;
    this._idIdentifier = value;
  }

  public get idIdentifier() {
    return this._idIdentifier;
  }

  public set requestIdName(value: string) {
    ResponseStructureConfig.instance.requestIdName = value;
    this._requestIdName = value;
  }

  public get requestIdName() {
    return this._requestIdName;
  }

  public set traceIdName(value: string) {
    ResponseStructureConfig.instance.traceIdName = value;
    this._traceIdName = value;
  }

  public get traceIdName() {
    return this._traceIdName;
  }
}
