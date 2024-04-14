import {
  IMessageCodeService,
  ResponseMessage,
  getMessageCodeService,
} from "../services/MessageCodeService";
import { ILogService, getLogService } from "../services/LogService";
import { Config } from "../CommonResponse.config";
describe("MessageCodeService", () => {
  let messageCodeService: IMessageCodeService;
  let logService: ILogService;

  beforeEach(() => {
    Config.instance.idIdentifier = "mock_identifier_MessageCodeService";
    Config.instance.requestIdName = "requestId_test";
    Config.instance.traceIdName = "traceId_test";

    messageCodeService = getMessageCodeService();
    logService = getLogService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a message code service", () => {
    expect(messageCodeService).toBeDefined();
  });

  // Should return the correct response message when given a valid code
  it("should return the correct response message when given a valid code", () => {
    const code = "TEST";
    const expectedResponseMessage = new ResponseMessage(code, "TEST", 200);

    const responseMessage = messageCodeService.getResponseMessageByCode(code);

    expect(responseMessage).toEqual(expectedResponseMessage);
  });

  it("should handle the code not defined in MessageCodes.json", () => {
    const responseMessage =
      messageCodeService.getResponseMessageByCode("UNDEFINED");

    expect(responseMessage).toBeUndefined();
  });

  it("should handle empty string", () => {
    const responseMessage = messageCodeService.getResponseMessageByCode("");

    expect(responseMessage).toBeUndefined();
  });

  // Should handle a message codes object with non-unique codes
  it("should handle non-unique codes in message codes object", () => {
    const code = "DUPLICATION_TEST";

    expect(messageCodeService.getResponseMessageByCode(code)).toThrow(
      "Multiple response messages found for code: DUPLICATION_TEST",
    );
  });

  // it("should handle MessageCodes.json not found", () => {
  //   const path = "invalid_path";
  //   const messageCodeService = new MessageCodeService(path, logService);

  //   expect(messageCodeService.Messages).toThrow(
  //     "Error loading default message codes file"
  //   );
  // });
});
