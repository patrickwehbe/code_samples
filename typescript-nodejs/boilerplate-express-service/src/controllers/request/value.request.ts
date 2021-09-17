import { IsNumber, IsOptional, IsString } from "class-validator";
import { CommonGETRequestValidation } from "common-platform-express";
import { SortByValueField, Value } from "../../models";

export class GetValueQuery extends CommonGETRequestValidation(
	SortByValueField
) {
	@IsString()
	@IsOptional()
	id: string;

	@IsString()
	@IsOptional()
	name?: string;
}

export class ValueGetMetaRequest {
	/**
	 * Id of value
	 */
	@IsOptional()
	@IsString()
	id: string;

	/**
	 * name of value
	 */
	@IsOptional()
	@IsString()
	name: string;

	/**
	 * items per page
	 */
	@IsNumber()
	itemsPerPage: number;
}

export class ValuePostRequest {
	/**
	 * Name of Value
	 */
	@IsString()
	name: string;

	/**
	 * Description of value
	 */
	@IsOptional()
	@IsString()
	description: string;

	/**
	 * Id of the organization that owns the value
	 */
	@IsString()
	organizationId: string;

	public static getValue(valueRequest: ValuePostRequest): Value {
		return {
			name: valueRequest.name,
			description: valueRequest.description,
			organizationId: valueRequest.organizationId,
		};
	}
}

export class ValuePutRequest {
	/**
	 * Name of Value
	 */
	@IsOptional()
	@IsString()
	name: string;

	/**
	 * Description of value
	 */
	@IsOptional()
	@IsString()
	description: string;

	public static getValue(valueRequest: ValuePutRequest): Value {
		return {
			name: valueRequest.name,
			description: valueRequest.description,
		};
	}
}
