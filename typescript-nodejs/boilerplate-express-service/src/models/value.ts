import { Model, FileInfo } from "common-platform-express";

import { IsString } from "class-validator";

export enum SortByValueField {
	name = "name",
}
export class Value extends Model {
	/**
	 * Name of Value
	 */
	name: string;

	/**
	 * Description of value
	 */
	description: string;

	/**
	 * Url of the file (stored in S3)
	 */
	fileInfo?: FileInfo;

	/**
	 * If of the organization that owns the value
	 */
	organizationId?: string;
}
