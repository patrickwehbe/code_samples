import { ExpressConfig } from "./express.config";
import { Logger } from "common-platform-express";
import { configLogger } from "common-platform-express";
import debug from "debug";
import env from "../../env";
import { registerServices } from "./container.config";
import { banner } from "common-platform-express";
import { registerSubscribers } from "./subscribers.config";

/**
 * Main application class
 * Creates the express server, launches it , and displays the banner.
 */
export class Application {
	server: any;
	express: ExpressConfig;

	constructor(dirname: string) {
		configLogger(env.isDevelopment, env.log.level);
		const log = new Logger("App");
		log.info("Starting...");
		this.express = new ExpressConfig(dirname);

		const debugLog: debug.IDebugger = debug("app");
		const port = env.app.port;

		registerServices(log);
		registerSubscribers(dirname, log);

		// Start Webserver
		this.server = this.express.app.listen(port, () => {
			debugLog(`Server running at http://localhost:${port}`);
		});

		banner(env, log);
	}
}
