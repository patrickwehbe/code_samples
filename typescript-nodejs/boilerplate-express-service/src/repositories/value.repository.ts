import { Value } from "../models";
import { Service } from "typedi";
import {
	ArangoService,
	IArangoFilter,
	IPaginationMetaData,
	NotFoundError,
} from "common-platform-express";
import { BaseRepository } from "../core/base.repository";
import { IValueRepository } from "./interfaces/value.interface";
import {
	GetValueQuery,
	ValueGetMetaRequest,
} from "../controllers/request/value.request";
@Service()
export class ValueRepository
	extends BaseRepository
	implements IValueRepository
{
	constructor(arangoService: ArangoService) {
		super(__filename, arangoService);
	}

	private constructArangoFilterParam(
		id?: string,
		name?: string
	): IArangoFilter[] {
		const filterparams: IArangoFilter[] = [];
		if (id) filterparams.push({ type: "_key", value: `"${id}"` });
		if (name) filterparams.push({ type: "name", value: `"${name}"` });
		return filterparams;
	}

	async getAllValues(
		organizationId: string,
		queryParams: GetValueQuery
	): Promise<Value[]> {
		this._logger.info(`Getting values from database`);

		let pageNumber = queryParams.pageNumber;
		if (pageNumber > 0) {
			pageNumber = pageNumber - 1;
		}
		const query = `
			FOR v IN value
			FILTER ${this._arangoService.constructFilters(
				"v",
				this.constructArangoFilterParam(queryParams.id, queryParams.name)
			)}
			AND v.organizationId  == @organizationId
			${this._arangoService.constructSort(queryParams.sort, queryParams.sortBy, "v")}
			${this._arangoService.constructLimit(queryParams.itemsPerPage, pageNumber)}
		    RETURN v
		`;
		const params = {
			organizationId: `${organizationId}`,
		};

		const values = await this._database.query<Value, any>(query, params);

		if (!values || values.length === 0)
			throw new NotFoundError("No value were found in the database");

		return values;
	}

	async getValueMeta(
		organizationId: string,
		queryParams: ValueGetMetaRequest
	): Promise<IPaginationMetaData> {
		this._logger.info(`Getting value  meta data from database`);

		const query = `
		FOR v IN value
			FILTER ${this._arangoService.constructFilters(
				"v",
				this.constructArangoFilterParam(queryParams.id, queryParams.name)
			)}
			AND v.organizationId == @organizationId
			COLLECT WITH COUNT INTO length 
			RETURN length `;

		const params = {
			organizationId: `${organizationId}`,
		};
		const value = await this._database.query<Value, any>(query, params);
		const valueCount = value[0] as unknown as number;
		return {
			itemsPerPage: queryParams.itemsPerPage,
			totalItems: valueCount,
			totalPages: Math.ceil(valueCount / queryParams.itemsPerPage),
		};
	}

	async getOneValue(organizationId: string, id: string): Promise<Value> {
		this._logger.info(`Getting value from database`);

		const query = `
			FOR v IN value
				FILTER v.isActive == true
				AND  v._key == @valueId
				AND v.organizationId == @organizationId
				RETURN v
		`;

		const params = {
			valueId: id,
			organizationId: organizationId,
		};

		const value = await this._database.query<Value, any>(query, params);

		//By default the arango query returns an array. We need to always get the first element
		if (!value || value.length === 0)
			throw new NotFoundError(`Value with id: ${id} not found in database`);

		return value.shift() as Value;
	}

	async createValue(value: Value): Promise<Value> {
		this._logger.info(`Adding new value in database`);

		const query = `
			INSERT @value INTO value
				OPTIONS {keepNull: false}
				RETURN NEW
		`;

		value.createdAt = +new Date();
		value.isActive = true;

		const params = { value };

		const createdValue = await this._database.query<Value, any>(query, params);

		//By default the arango query returns an array. We need to always get the first element
		return createdValue.shift() as Value;
	}

	async updateValue(id: string, value: Value): Promise<Value> {
		this._logger.info(`Update value with key ${id}`);

		const query = `
			FOR v in value
				FILTER v.isActive == true
				AND v._key == @valueId
				UPDATE v
					WITH {
						name: @name == null ? v.name : @name,
						description: @description == null ? v.description: @description,
						fileInfo: @fileInfo == null ? v.fileInfo: @fileInfo,
						modifiedAt: @timestamp
					}
				IN value
				OPTIONS {keepNull: false}
				RETURN NEW
		`;

		const params = {
			valueId: id,
			name: value.name ? value.name : null,
			description: value.description ? value.description : null,
			fileInfo: value.fileInfo ? value.fileInfo : null,
			timestamp: +new Date(),
		};

		const updatedValue = await this._database.query<Value, any>(query, params);

		if (!updatedValue || updatedValue.length === 0)
			throw new NotFoundError(`Value with id: ${id} not found in database`);

		//By default the arango query returns an array. We need to always get the first element
		return updatedValue.shift() as Value;
	}

	async deleteValue(valueId: string): Promise<Value> {
		this._logger.info(`Deleting value with key ${valueId}`);

		const query = `
			FOR v in value
				FILTER v.isActive == true
				AND v._key == @valueId
				UPDATE v
					WITH {
						isActive: false,
						deletedAt: @timestamp,
						modifiedAt: @timestamp
					}
				IN value
				OPTIONS {keepNull: false}
				RETURN NEW
		`;

		const params = {
			valueId,
			timestamp: +new Date(),
		};

		const deletedValue = await this._database.query<Value, any>(query, params);

		if (!deletedValue || deletedValue.length === 0)
			throw new NotFoundError(
				`Value with id: ${valueId} not found in database`
			);

		//By default the arango query returns an array. We need to always get the first element
		return deletedValue.shift() as Value;
	}
}
