//#region  IMPORTS
import {
	Logger,
	configLogger,
	ICollection,
	createDatabase,
	createCollections,
	IArangoOptions,
} from "common-platform-express";
import env from "../src/Env";
//#endregion  IMPORTS

//#region  GLOBAL CONFIGS

//Parsing Arango Options
const ARANGO_OPTIONS: IArangoOptions = env.database as IArangoOptions;

//Define Logger
const _logger = new Logger(__filename);

//#endregion  GLOBAL CONFIGS

//#region SETTINGS -------------------------- YOUR INPUT IS NEEDED HERE----------------------------------------

//Set to true if you want to delete the data that already exists in the database
const DELETE_PREVIOUS = true;

/**
 * Collections to be created in Arango
 */
const COLLECTIONS: ICollection[] = [
	{
		name: "value",
	},
	// Adding edge collection
	// {
	// 	name: "edgeOfValue",
	// 	isEdge: true
	// }
];

//#endregion SETTINGS -------------------------- YOUR INPUT IS NEEDED HERE----------------------------------------

//#region MAIN

async function main() {
	configLogger(true, "info");

	_logger.info("Creating database...");
	//If database already, nothing happens
	await createDatabase(ARANGO_OPTIONS.db, ARANGO_OPTIONS);

	_logger.info("Creating collections...");
	//Create collections. The deletePrevious flag will define wether we delete already existing data or not.
	await createCollections(COLLECTIONS, ARANGO_OPTIONS, DELETE_PREVIOUS);
}

main().then((x) => {
	_logger.info("Db Configuration finished...");
});

//#endregion MAIN
