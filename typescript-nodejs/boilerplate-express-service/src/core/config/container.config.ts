import { Container } from "typedi";
import env from "../../env";
import {
	AMQPService,
	ArangoService,
	EnvVariableError,
	ILogger,
	RedisService,
} from "common-platform-express";

/**
 * Registers services in container
 * Used for dependency injection
 */
 export const registerServices = (logger: ILogger) => {
	if (!env.database)
		throw new EnvVariableError(
			"Database used but environment variables not set"
		);

	logger.info("Registering Arango Service");
	// Singleton Arango DB Connection
	Container.set(ArangoService, new ArangoService(env.database));

	logger.info("Registering Message Bus Service");
	// Singleton Message Bus connection
	// Singleton Message Bus connection
	Container.set(AMQPService, new AMQPService([env.messageBus.host], logger));

	logger.info("Registering Redis Service");
	Container.set(
		RedisService,
		new RedisService(env.redis.host, env.redis.port, "Common", logger)
	);
};
