import * as fs from "fs";
import { ILogService } from "./LogService";

export interface IMessageCodeService {
  Messages: any;
  getResponseMessageByCode(code: string): ResponseMessage | undefined;
}

interface ResponseMessages {
  [key: string]: {
    [key: string]: ResponseMessage;
  };
}

export class ResponseMessage {
  Code: string;
  Message: string;
  StatusCode: number;

  constructor(code: string, message: string, statusCode: number) {
    this.Code = code;
    this.Message = message;
    this.StatusCode = statusCode;
  }
}

export class MessageCodeService {
  private message: any;
  public get Messages(): ResponseMessages {
    return this.message;
  }
  private readonly defaultMessagesPath: string;
  constructor(
    private logService: ILogService,
    path?: string,
  ) {
    this.defaultMessagesPath = path || "src/models/MessageCodes.json";
    this.logService.setServiceName(MessageCodeService.name);

    try {
      // try to read if developer has provided custom message codes
      // otherwise use default message codes
      const data = fs.readFileSync(this.defaultMessagesPath, "utf8");

      // TODO: should concatenate the default message codes with the custom message codes
      this.message = JSON.parse(data);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        // use default message codes
        try {
          const data = fs.readFileSync(
            "node_modules/@lst97/common_response/lib/cjs/src/models/MessageCodes.json",
            "utf8",
          );

          this.message = JSON.parse(data);
        } catch (e: any) {
          throw new Error("Error loading default message codes file");
        }
      } else {
        this.logService.error(e);
        throw e;
      }
    }
  }
  public getResponseMessageByCode(code: string): ResponseMessage | undefined {
    for (const category in this.Messages) {
      if (Object.prototype.hasOwnProperty.call(this.Messages, category)) {
        const responseMessages = this.Messages[category];
        for (const key in responseMessages) {
          if (Object.prototype.hasOwnProperty.call(responseMessages, key)) {
            const responseMessage = responseMessages[key];
            if (responseMessage.Code === code) {
              // TODO: check if the code is unique
              return responseMessage;
            }
          }
        }
      }
    }
  }
}

// // ...other imports
// const path = require('path');

// // ...

// constructor() {
//   // ...
//   const customMessagePath = path.resolve(__dirname, "src/models/MessageCodes.json");
//   const defaultMessagePath = path.resolve('node_modules', '@lst97/common_response', 'lib', 'cjs', 'src', 'models', 'MessageCodes.json');

//   try {
//     this.Messages = this.loadMessages(customMessagePath);
//     this.Messages = this.mergeMessages(this.Messages, this.loadMessages(defaultMessagePath));
//   } catch (error) {
//     this.logService.error('Error loading message codes:', error); // More informative error logging
//     // Consider a structured error response here
//   }
// }

// // Helper to load messages from a path
// private loadMessages(filePath) {
//   try {
//     // ... your existing file loading logic
//   } catch (error) {
//     // Handle errors specifically
//   }
// }

// // Helper to merge messages (implementation will depend on desired merge logic)
// private mergeMessages(messages1, messages2) {
//   // ... implementation for your merge strategy
// }

// // Consider using a Map for better lookup performance
// private messagesMap = new Map();
// constructor() {
//     // ...
//     this.populateMessagesMap(this.Messages);
// }

// populateMessagesMap(messages) {
//     // ... logic to populate the messagesMap
// }

// getResponseMessageByCode(code: string): ResponseMessage | undefined {
//     return this.messagesMap.get(code);
// }

// // ...
