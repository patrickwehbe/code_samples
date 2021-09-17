import * as dotenv from "dotenv";
import * as path from "path";
import * as pkg from "../package.json";
import { EnvVariable } from "common-platform-express";

/**
 * Load .env.local for local development otherwise use .env (or OS env. variables)
 */
dotenv.config({
	path: path.join(
		process.cwd(),
		`.env${process.env.NODE_ENV === "development" ? ".local" : ""}`
	),
});

const defaultEnv = new EnvVariable(process.env, pkg, true);

/**
 * To extend the environment variables
 *
 * let defaultEnv = new EnvVariable(process.env, pkg, true);
 *
 * const env = {
 *  	...defaultEnv,
 *		newVariable: EnvVariable.getStringEnvVariable(process.env, "NEW_VARIABLE"),
 *	};
 */

const env = {
	...defaultEnv,
	services: {
		valueServiceUrl: EnvVariable.getStringEnvVariable(
			process.env,
			"VALUE_SERVICE_URL"
		),
	},
	messageBus: {
		host: EnvVariable.getStringEnvVariable(process.env, "RABBITMQ_HOST"),
		queues: {
			createValue: "value.create",
		},
	},
	aws: {
		accessKeyId: EnvVariable.getStringEnvVariable(
			process.env,
			"AWS_ACCESS_KEY_ID"
		),
		secretAccessKey: EnvVariable.getStringEnvVariable(
			process.env,
			"AWS_SECRET_ACCESS_KEY"
		),
		s3: {
			region: EnvVariable.getStringEnvVariable(process.env, "AWS_S3_REGION"),
			bucket: EnvVariable.getStringEnvVariable(
				process.env,
				"AWS_S3_BUCKET_NAME"
			),
		},
	},
	redis: {
		host: EnvVariable.getStringEnvVariable(process.env, "REDIS_HOST"),
		port: EnvVariable.getNumberEnvVariable(process.env, "REDIS_PORT"),
	},
};

export default env;
