import { BaseService, Context } from "../core";
import { ValueRepository } from "../repositories";
import { Value } from "../models";
import {
	AWSS3Service,
	FileUpload,
	AMQPService,
} from "common-platform-express";
import env from "../env";
import { Service } from "typedi";

@Service()
export class ValueService extends BaseService {
	private _fileService: AWSS3Service;
	private readonly VALUE_STORAGE_PATH = "test-nick/";

	constructor(
		private _valueRepo: ValueRepository,
		private _messageBusService: AMQPService
	) {
		super(__filename);

		this._fileService = new AWSS3Service(
			env.aws.s3.region,
			{
				accessKeyId: env.aws.accessKeyId,
				secretAccessKey: env.aws.secretAccessKey,
			},
			this._logger
		);
	}

	/**
	 * Creates value in the database
	 * @param value value to save
	 * @return value created (in an array for consistency)
	 */
	async createValue(value: Value, file?: FileUpload): Promise<Value> {
		this._logger.info("Creating value...");

		// Store note in database
		let createdValue = await this._valueRepo.createValue(value);

		const createdValueId = createdValue._key;

		if (file) {
			this._logger.info(
				`Uploading file of value with Id ${createdValueId} to S3`
			);
			// Upload file to S3
			const fileInfo = await this._fileService.uploadFile(
				`${createdValueId}`,
				`${file.originalname.split(".").pop()}`,
				file.buffer,
				env.aws.s3.bucket,
				this.VALUE_STORAGE_PATH
			);

			this._logger.info(
				`Successfully uploaded file of value with Id ${createdValueId} to S3`
			);

			this._logger.info(
				`Publishing message to the bus to update file info of value with Id ${createdValueId}`
			);

			createdValue.fileInfo = fileInfo;
			this._messageBusService.publishQueue(env.messageBus.queues.createValue, {
				appName: env.app.name,
				requestId: Context.getRequestId(),
				data: createdValue,
				timestamp: +new Date(),
			});
		}

		this._logger.info("Successfully created value in the database");

		return createdValue;
	}

	async deleteValue(id: string): Promise<Value> {
		this._logger.info(`Deleting value with Id ${id}`);

		const deletedValue = await this._valueRepo.deleteValue(id);

		if (deletedValue.fileInfo) {
			this._logger.info(`Deleting file with key ${deletedValue.fileInfo.key}`);
			await this._fileService.deleteFile(
				env.aws.s3.bucket,
				deletedValue.fileInfo.key
			);
			this._logger.info(
				`Successfully deleted file with key ${deletedValue.fileInfo.key}`
			);
		}

		this._logger.info("Successfully created value in the database");

		return deletedValue;
	}
}
