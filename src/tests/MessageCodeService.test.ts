import Container from "typedi";
import {
  MessageCodeService,
  ResponseMessage,
} from "../services/MessageCodeService";
import { LogService } from "../services/LogService";

describe("MessageCodeService", () => {
  let messageCodeService: MessageCodeService;

  beforeEach(() => {
    Container.set(LogService, new LogService());
    messageCodeService = new MessageCodeService(Container.get(LogService));
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

  it("should handle MessageCodes.json not found", () => {
    const path = "invalid_path";
    const messageCodeService = new MessageCodeService(
      Container.get(LogService),
      path,
    );

    expect(messageCodeService.Messages).toThrow(
      "Error loading default message codes file",
    );
  });
});
