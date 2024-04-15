import { Container } from "inversify";
import {
  ErrorHandlerService,
  IErrorHandlerService,
} from "./services/ErrorHandlerService";
import { IResponseService, ResponseService } from "./services/ResponseService";
import {
  DefinedBaseError,
  useInversify as useCommonErrorsInversify,
} from "@lst97/common-errors";
import { useInversify as useCommonServicesInversify } from "@lst97/common-services";
import { Config } from "./CommonResponse.config";
/**
 * For the user to get the singleton instance of the services,
 * Support to use the provided container to build the services.
 * If not provided, it will create a new container for the services.
 * It makes use it use the singleton instance of the services.
 *
 */
export class Containers {
  private static _instance: Containers;
  private container: Container;

  private constructor() {
    this.container = new Container();
    this.buildContainers();
  }

  public static get instance() {
    if (!Containers._instance) {
      Containers._instance = new Containers();
    }
    return Containers._instance;
  }

  public get inversifyContainer() {
    return this.container;
  }

  private buildContainers() {
    this.buildConstantsContainer();
    this.buildLibContainers();
    this.buildServiceContainer();
  }

  private buildLibContainers() {
    useCommonServicesInversify(this.container);
    useCommonErrorsInversify(this.container);
  }

  // Arguments that required for the services
  private buildConstantsContainer() {
    // error callback for ErrorHandlerService
    if (this.container.isBound("ErrorCallback")) {
      this.container.unbind("ErrorCallback");
    }
    this.container
      .bind<(error: DefinedBaseError) => void>("ErrorCallback")
      .toConstantValue(Config.instance.errorCallback);
  }
  private buildServiceContainer() {
    if (!this.container.isBound(ErrorHandlerService)) {
      this.container
        .bind<IErrorHandlerService>(ErrorHandlerService)
        .toSelf()
        .inSingletonScope();
    }

    if (!this.container.isBound(ResponseService)) {
      this.container
        .bind<IResponseService>(ResponseService)
        .toSelf()
        .inSingletonScope();
    }
  }

  public useInversify(container: Container) {
    // use the user provided container to build the middleware containers
    this.container = container;
    this.buildContainers();
  }
}

/**
 * For the user to inject the services into the application.
 *
 * @param container - The user provided container.
 *
 * @example
 * ```typescript
 * import { useInversify } from '@lst97/common_response';
  const container = new Container();
  function buildLibContainers() {
    useInversify(container);
  }
 * ```
 */
export const useInversify = (container: Container) => {
  Containers.instance.useInversify(container);
};

/**
 * For internal use only.
 * @returns the singleton instance of the container
 */
export const inversifyContainer = () => {
  return Containers.instance.inversifyContainer;
};
