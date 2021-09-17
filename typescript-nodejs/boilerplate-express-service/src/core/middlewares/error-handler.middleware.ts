import * as express from "express";
import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from "routing-controllers";
import { Service } from "typedi";
import env from "../../env";
import {
  Logger,
  ErrorResponse,
  BaseError,
} from "common-platform-express";

/**
 * Catches all errors, logs them, and formats the responses
 */
@Middleware({ type: "after" })
@Service()
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  private isProduction = env.isProduction;

  constructor(private _logger) {
    this._logger = new Logger(__filename);
  }

  public error(
    error: BaseError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void {
    //Set requestId of logger to keep track of request
    this.setLogger(req);

    //Set http code & response message otherwise
    res.status(error.httpCode || 400);
    res.json(new ErrorResponse(error));

    //Log error
    if (this.isProduction) {
      this._logger.error(error["name"], error["message"]);
    } else {
      this._logger.error(error["name"], error["stack"], error["errors"]);
    }
  }

  /**
   * Resets the request of the logger.
   * Context is lost after an exception. That's why we keep the requestId as part of the express request as well.
   * @param req express request
   */
  private setLogger(req: express.Request) {
    const requestId = req.headers["requestId"]
      ? req.headers["requestId"].toString()
      : "";

    this._logger.setRequestId(requestId);
  }
}
