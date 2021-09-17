import { ILogger, AMQPService } from "common-platform-express";
import { Service } from "typedi";
import env from "../env";
import { Value } from "../models";
import { ValueRepository } from "../repositories";

@Service()
export class ValueSubscriber {
	constructor(
		private _messageBusService: AMQPService,
		private _logger: ILogger,
		private _valueRepository: ValueRepository
	) {
		this.onValueCreate();
	}

	onValueCreate() {
		const QUEUE_NAME = env.messageBus.queues.createValue;

		this._logger.info(
			`Registering onValueCreate subscriber. Queue name: ${QUEUE_NAME}`
		);

		this._messageBusService.assertQueue(QUEUE_NAME);

		this._messageBusService.subscribeQueue(QUEUE_NAME, async (message: any) => {
			this._logger.info("Update value with file info");
			this._logger.info(JSON.stringify(message));
			// TODO: for later we need to create an abstract message class and put requestId as property for logging purposes
			const { requestId, data } = message;
			this._valueRepository.setRequestId(requestId);
			this._valueRepository.updateValue(`${data.id}`, data);

			this._logger.info("Successfully updated value with file info");
		});
	}
}
