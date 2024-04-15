import { DefinedBaseError } from "@lst97/common-errors";
import { Config as ResponseStructureConfig } from "@lst97/common-response-structure";
import { Config as CommonErrorsConfig } from "@lst97/common-errors";
import { Containers } from "./inversify.config";

const SERVICE_NAME = "@lst97/common_response";
export class Config {
  private static _instance: Config;
  private _idIdentifier: string = SERVICE_NAME;
  private _requestIdName: string = "requestId";
  private _traceIdName: string = "traceId";
  private _errorCallback: (error: DefinedBaseError) => void = (
    _error: DefinedBaseError,
  ) => {};

  private constructor() {}

  public static get instance() {
    if (!Config._instance) {
      // Set for Schemas rules
      ResponseStructureConfig.instance.idIdentifier = SERVICE_NAME;
      CommonErrorsConfig.instance.idIdentifier = SERVICE_NAME;
      Config._instance = new Config();
    }
    return Config._instance;
  }

  public set idIdentifier(value: string) {
    ResponseStructureConfig.instance.idIdentifier = value;
    CommonErrorsConfig.instance.idIdentifier = value;
    this._idIdentifier = value;
  }

  public get idIdentifier() {
    return this._idIdentifier;
  }

  public set requestIdName(value: string) {
    ResponseStructureConfig.instance.requestIdName = value;

    CommonErrorsConfig.instance.requestIdName = value;
    this._requestIdName = value;
  }

  public get requestIdName() {
    return this._requestIdName;
  }

  public set traceIdName(value: string) {
    ResponseStructureConfig.instance.traceIdName = value;
    CommonErrorsConfig.instance.traceIdName = value;
    this._traceIdName = value;
  }

  public get traceIdName() {
    return this._traceIdName;
  }

  public set errorCallback(value: (error: DefinedBaseError) => void) {
    this._errorCallback = value;

    if (Containers.instance.inversifyContainer.isBound("ErrorCallback")) {
      Containers.instance.inversifyContainer.unbind("ErrorCallback");
    }
    Containers.instance.inversifyContainer
      .bind<(error: DefinedBaseError) => void>("ErrorCallback")
      .toConstantValue(value);
  }

  public get errorCallback() {
    return this._errorCallback;
  }
}
