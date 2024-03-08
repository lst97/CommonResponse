declare class LogService {
    private logger;
    constructor();
    init(): void;
    setServiceName(service: string): void;
    error(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    debug(message: string): void;
}
export default LogService;
