import {
	GetValueQuery,
	ValueGetMetaRequest,
} from "../../controllers/request/value.request";
import { IPaginationMetaData } from "common-platform-express";
import { Value } from "../../models";

export interface IValueRepository {
	/**
	 * Gets all values
	 * @param organizationId id of the organization that owns the value
	 * @param queryParams query params passed (filters, sorting, pagination)
	 * @returns all the values
	 */
	getAllValues(
		organizationId: string,
		queryParams: GetValueQuery
	): Promise<Value[]>;

	/**
	 * Gets one value from the database
	 * @param organizationId id of the organization that owns the value
	 * @param id if of value to return
	 */
	getOneValue(organizationId: string, id: string): Promise<Value>;

	/**
	 * Counts the total values available in the database given the filters
	 * @param organizationId id of the organization that owns the value
	 * @param queryParams query params passed (filters, sorting, pagination)
	 */
	getValueMeta(
		organizationId: string,
		queryParams: ValueGetMetaRequest
	): Promise<IPaginationMetaData>;

	/**
	 * Creates the value in the database
	 * @param value product object
	 * @returns created value object
	 */
	createValue(value: Value): Promise<Value>;

	/**
	 * Updates the value in the database
	 * @param id of value to update
	 * @param value value object
	 * @returns updated value object
	 */
	updateValue(id: string, value: Value): Promise<Value>;

	/**
	 * Deletes the value from the database (soft delete)
	 * @param id _key property of value
	 * @returns deleted value object
	 */
	deleteValue(id: string): Promise<Value>;
}
