import {ILogger, LogLevel} from "@microsoft/signalr";

export class MyLogger implements ILogger {
  log(logLevel: LogLevel, message: string) {
    //would be blank
  }
}
