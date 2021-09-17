import {
	JsonController,
	Param,
	Body,
	Get,
	Post,
	Put,
	Delete,
	UploadedFile,
	QueryParam,
	QueryParams,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import Container, { Service } from "typedi";
import { BaseService } from "../core/base.service";
import { Context } from "../core";
import { Value } from "../models";
import { ValueService } from "../services";
import { ValueResponse } from "./response/value.response";
import {
	GetValueQuery,
	ValueGetMetaRequest,
	ValuePostRequest,
	ValuePutRequest,
} from "./request/value.request";
import { ValueRepository } from "../repositories";
import {
	FileUpload,
	PaginationMetaResponse,
	IPaginationMetaData,
} from "common-platform-express";

@JsonController()
@Service()
export class ValueController extends BaseService {
	private _valueService: ValueService;

	constructor(private readonly _valueRepository: ValueRepository) {
		super(__filename);
		this._valueService = Container.get(ValueService);
	}

	@Get("/value")
	@OpenAPI({
		summary: "List all available values",
		responses: {
			"404": {
				description: "No value found in database",
			},
		},
	})
	@ResponseSchema(ValueResponse, { isArray: true })
	async getAll(
		@QueryParams() queryParams: GetValueQuery
	): Promise<ValueResponse[]> {
		this._logger.info(`Getting all values`);

		// We will get this from the user header. Showcasing how we can extend the usage of the filter.
		const organizationId = "org-1";

		let valueList = await this._valueRepository.getAllValues(
			organizationId,
			queryParams
		);
		return ValueResponse.getValueResponseList(valueList);
	}
	//#endregion GET Value

	//#region GET Value Metadata
	@Get("/value-meta")
	@OpenAPI({
		summary: "Get meta data for pagination",
		responses: {
			"404": {
				description: "Can't get the metadata",
			},
		},
	})
	@ResponseSchema(PaginationMetaResponse)
	async getValueCount(
		@QueryParam("itemsPerPage") itemsPerPage: number,
		@QueryParams() queryParams: ValueGetMetaRequest
	): Promise<IPaginationMetaData> {
		this._logger.info(`Getting organization meta`);

		// We will get this from the user header. Showcasing how we can extend the usage of the filter.
		const organizationId = "org-1";

		return await this._valueRepository.getValueMeta(
			organizationId,
			queryParams
		);
	}
	//#endregion GET Value Metadata

	//#region GET One Value
	@Get("/value/:id")
	@OpenAPI({
		summary: "Get specific value by id",
		responses: {
			"404": {
				description: "No value found in database",
			},
		},
	})
	@ResponseSchema(ValueResponse)
	async getOne(@Param("id") id: string): Promise<ValueResponse> {
		this._logger.info(`Getting value with Id: ${id}`);

		// We will get this from the user header. Showcasing how we can extend the usage of the filter.
		const organizationId = "org-1";

		const value = await this._valueRepository.getOneValue(organizationId, id);
		return ValueResponse.getValueResponse(value);
	}
	//#endregion GET One Value

	//#region POST Value
	@Post("/value")
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
		@Body({ required: true }) value: ValuePostRequest
	): Promise<ValueResponse> {
		this._logger.info(`Creating value`);
		let addedValue = await this._valueService.createValue(
			ValuePostRequest.getValue(value)
		);
		return ValueResponse.getValueResponse(addedValue);
	}
	//#endregion POST Value

	//#region PUT Value
	@Put("/value/:id")
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
		@Body({ required: true }) value: ValuePutRequest
	): Promise<Value> {
		this._logger.info(`Updating value`);
		let updatedValue = await this._valueRepository.updateValue(
			id,
			ValuePutRequest.getValue(value)
		);

		return ValueResponse.getValueResponse(updatedValue);
	}
	//#endregion PUT Value

	//#region Delete Value
	@Delete("/value/:id")
	@OpenAPI({
		summary: "Delete a value",
		responses: {
			"404": {
				description: "Value not found",
			},
		},
	})
	@ResponseSchema(Value)
	async delete(@Param("id") id: string): Promise<ValueResponse> {
		this._logger.info(`Deleting value with Id: ${id}`);
		let deletedValue = await this._valueService.deleteValue(id);
		return ValueResponse.getValueResponse(deletedValue);
	}
	//#endregion Delete Value

	//#region POST File of Value
	@Post("/value/file")
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
		@Body({ required: true }) value: ValuePostRequest,
		@UploadedFile("filename") file?: FileUpload
	): Promise<ValueResponse> {
		this._logger.info(`Create a value and uploading its file`);

		const createdValue = await this._valueService.createValue(value, file);

		return ValueResponse.getValueResponse(createdValue);
	}
	//#endregion POST File of Value
}
