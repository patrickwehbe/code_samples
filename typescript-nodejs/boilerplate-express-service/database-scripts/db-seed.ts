//#region  IMPORTS
import {
	Logger,
	configLogger,
	ArangoService,
	IArangoOptions,
} from "common-platform-express";
import env from "../src/Env";
import { Value } from "../src/models/value";

//#endregion  IMPORTS

//#region  GLOBAL CONFIGS

//Define Logger
const _logger = new Logger(__filename);

//Parsing Arango Options
const ARANGO_OPTIONS: IArangoOptions = env.database as IArangoOptions;

// Arango connection used to insert data
const _connection = new ArangoService(ARANGO_OPTIONS).getConnection(_logger);

//#endregion  GLOBAL CONFIGS

//#region DATA -------------------------- YOUR INPUT IS NEEDED HERE----------------------------------------
const values: Value[] = [
	{
		_id: "value/1",
		_key: "1",
		name: "test-1",
		description: "This is test-1",
		organizationId: "org-1",
		isActive: true,
		createdAt: +new Date(),
	},
	{
		_id: "value/2",
		_key: "2",
		name: "test-2",
		description: "This is test-2",
		organizationId: "org-1",
		isActive: true,
		createdAt: +new Date(),
	},
	{
		_id: "value/3",
		_key: "3",
		name: "test-3",
		description: "This is test-3",
		organizationId: "org-2",
		isActive: true,
		createdAt: +new Date(),
	},
	{
		_id: "value/4",
		_key: "4",
		name: "test-4",
		description: "This is test-4",
		organizationId: "org-3",
		isActive: true,
		createdAt: +new Date(),
	},
];
//#endregion DATA -------------------------- YOUR INPUT IS NEEDED HERE----------------------------------------

//#region MAIN
async function main() {
	configLogger(true, "info");
	_logger.info("Db Data starting...");

	await _connection.bulkInsert("value", values);
}

main().then((x) => {
	_logger.info("Db Data finished...");
});

//#endregion MAIN
