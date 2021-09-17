import {
	JsonController,
	Param,
	Body,
	Get,
	Post,
	Put,
	Delete,
	Req,
	UploadedFile,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { BaseService } from "../core/base.service";
import { ValueResponse } from "./response/value.response";
import { ValuePostRequest, ValuePutRequest } from "./request/value.request";
import {
	HttpClientService,
	FileUpload,
	RedisService,
} from "common-platform-express";
import env from "../env";
import { forwardFormDataRequest, forwardRequest } from "./forwarding.utils";

@JsonController()
@Service()
export class APIGatwayController extends BaseService {
	private _httpClient: HttpClientService;

	constructor(private readonly _redisService: RedisService) {
		super(__filename);
		this._httpClient = new HttpClientService(this._logger);
	}

	//#region GET Value
	@Get("/gateway/value")
	@OpenAPI({
		summary: "List all available values",
		responses: {
			"404": {
				description: "No value found in database",
			},
		},
	})
	@ResponseSchema(ValueResponse, { isArray: true })
	async getAll(@Req() req: any): Promise<ValueResponse[]> {
		this._logger.info("Routing request to Value Service");
		let response = await forwardRequest<ValueResponse[]>(
			this._httpClient,
			env.services.valueServiceUrl,
			req
		);
		return response;
	}
	//#endregion GET Value

	//#region GET One Value
	@Get("/gateway/value/:id")
	@OpenAPI({
		summary: "Get specific value by id",
		responses: {
			"404": {
				description: "No value found in database",
			},
		},
	})
	@ResponseSchema(ValueResponse)
	async getOne(
		@Param("id") id: string,
		@Req() req: any
	): Promise<ValueResponse> {
		//Currently, organizationId is useless
		const organizationId = "org-1";
		const cachingKey = `value:${id}`;

		// Check if value exists in cache
		let cachedValue = await this._redisService.getAsync<ValueResponse>(
			organizationId,
			cachingKey
		);

		// If yes return it to the user
		if (cachedValue) return cachedValue;

		this._logger.info("Routing request to Value Service");
		// Otherwise get it from the service
		const valueResponse = await forwardRequest<ValueResponse>(
			this._httpClient,
			env.services.valueServiceUrl,
			req
		);

		// Set it in the cache
		await this._redisService.setAsync(
			organizationId,
			cachingKey,
			valueResponse
		);

		return valueResponse;
	}
	//#endregion GET One Value

	//#region POST Value
	@Post("/gateway/value")
	@OpenAPI({
		summary: "Create a new value",
		responses: {
			"400": {
				description: "Bad request",
			},
		},
	})
	@ResponseSchema(ValueResponse)
	async post(
		@Body({ required: true }) value: ValuePostRequest,
		@Req() req: any
	): Promise<ValueResponse> {
		this._logger.info("Routing request to Value Service");
		return await forwardRequest<ValueResponse>(
			this._httpClient,
			env.services.valueServiceUrl,
			req
		);
	}
	//#endregion POST Value

	//#region PUT Value
	@Put("/gateway/value/:id")
	@OpenAPI({
		summary: "Update a new value",
		responses: {
			"404": {
				description: "No value found in database",
			},
		},
	})
	@ResponseSchema(ValueResponse)
	async put(
		@Param("id") id: string,
		@Req() req: any,
		@Body({ required: true }) value: ValuePutRequest
	): Promise<ValueResponse> {
		this._logger.info("Routing request to Value Service");

		// Invalidate the cache
		const organizationId = "org-1";
		const cachingKey = `value:${id}`;
		await this._redisService.deleteAsync(organizationId, cachingKey);

		return await forwardRequest<ValueResponse>(
			this._httpClient,
			env.services.valueServiceUrl,
			req
		);
	}
	//#endregion PUT Value

	//#region Delete Value
	@Delete("/gateway/value/:id")
	@OpenAPI({
		summary: "Delete a value",
		responses: {
			"404": {
				description: "Value not found",
			},
		},
	})
	@ResponseSchema(ValueResponse)
	async delete(
		@Param("id") id: string,
		@Req() req: any
	): Promise<ValueResponse> {
		this._logger.info("Routing request to Value Service");

		// Invalidate the cache
		const organizationId = "org-1";
		const cachingKey = `value:${id}`;
		await this._redisService.deleteAsync(organizationId, cachingKey);

		return await forwardRequest<ValueResponse>(
			this._httpClient,
			env.services.valueServiceUrl,
			req
		);
	}
	//#endregion Delete Value

	//#region POST File of Value
	@Post("/gateway/value/file")
	@OpenAPI({
		summary: "Upload file and create new Value in the database",
		responses: {
			"400": {
				description: "Unable to upload the file",
			},
		},
	})
	@ResponseSchema(ValueResponse)
	async addValueWithFile(
		@Req() req: any,
		@Body({ required: true }) value: ValuePostRequest,
		@UploadedFile("filename") file: FileUpload
	): Promise<ValueResponse> {
		this._logger.info("Routing request to Value Service");

		return await forwardFormDataRequest<ValueResponse>(
			this._httpClient,
			req,
			env.services.valueServiceUrl,
			value,
			{ filename: file }
		);
	}
	//#endregion POST File of Value
}
