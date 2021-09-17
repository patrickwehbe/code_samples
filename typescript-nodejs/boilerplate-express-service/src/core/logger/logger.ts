import {
	Logger as winstonLogger,
	ILogger,
} from "common-platform-express";
import { Context } from "..";

export class Logger implements ILogger {
	private _logger: winstonLogger;
	private _requestId?: string;

	constructor(scope?: string, requestId?: string) {
		this._logger = new winstonLogger(scope);
		this._requestId = requestId;
	}

	public debug(message: string, ...args: any[]): void {
		const requestId = this._requestId ?? Context.getRequestId();
		this._logger.debug(`${this.formatHeader(requestId, message)}`, ...args);
	}

	public info(message: string, ...args: any[]): void {
		const requestId = this._requestId ?? Context.getRequestId();
		this._logger.info(`${this.formatHeader(requestId, message)}`, ...args);
	}

	public warn(message: string, ...args: any[]): void {
		const requestId = this._requestId ?? Context.getRequestId();
		this._logger.warn(`${this.formatHeader(requestId, message)}`, ...args);
	}

	public error(message: string, ...args: any[]): void {
		const requestId = this._requestId ?? Context.getRequestId();
		this._logger.error(`${this.formatHeader(requestId, message)}`, ...args);
	}

	public setRequestId(requestId: string) {
		this._requestId = requestId;
	}

	private formatHeader(requestId: string, message: string): string {
		return `-- Request Id ${requestId}: ${message}`;
	}
}
