// import pino from "pino";
import { LogService } from "../services/LogService";

jest.mock("pino", () => {
  return jest.fn().mockImplementation(() => {
    return {
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      flush: jest.fn(),
    };
  });
});

describe("LogService", () => {
  let logService: LogService;

  beforeEach(() => {
    logService = new LogService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a logger", () => {
    expect(logService).toBeDefined();
  });

  // it("should set the service name", () => {
  //   const buffer: string[] = [];
  //   const destination = pino.destination({
  //     sync: true,
  //     write: (msg: string) => buffer.push(msg),
  //   });
  //   logger = pino(destination);
  //   logService = new LogService(logger);
  //   logService.setServiceName("TestService");

  //   // Override the standard console with our Pino instance
  //   const originalConsole = global.console;
  //   global.console = {
  //     ...originalConsole,
  //     log: jest.fn((...args: any[]) => {
  //       const message = args.map((arg) => String(arg)).join(" ");
  //       buffer.push(message);
  //     }), // Mock the console.log method
  //   };

  //   logService.info("Test message");
  //   logger.flush(); // Flush the logs

  //   // Assertions
  //   expect(buffer).toHaveLength(1); // Assuming one log message
  //   expect(buffer[0]).toContain("Test message");
  //   const logEntry = JSON.parse(buffer[0]);
  //   expect(logEntry.service).toEqual("TestService");
  // });

  it("should throw an error for invalid service names", () => {
    expect(() => logService.setServiceName("")).toThrow("Invalid service name");
  });

  it("should log error messages", () => {
    logService.setServiceName("TestService");
    logService.error("An error occurred");
    expect(logService.logger.error).toHaveBeenCalledWith(
      { service: "TestService" },
      "An error occurred",
    );
  });
});
