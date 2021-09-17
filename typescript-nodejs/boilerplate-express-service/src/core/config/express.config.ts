import express from "express";
import * as httpContext from "express-http-context";
import { useContainer, useExpressServer } from "routing-controllers";
import { Container } from "typedi";
import env from "../../env";
import swaggerUiExpress from "swagger-ui-express";
import { getSwaggerSpec } from "./swagger.config";

export class ExpressConfig {
	app: express.Application;

	constructor(dirname: string) {
		this.app = express();

		//Setup http context
		this.app.use(httpContext.middleware);

		//Attach Routing Controllers container to Type DI
		useContainer(Container);

		this.configExpress(dirname);
		this.configHealthRoute();
		this.configSwaggerRoute(dirname);
	}

	configExpress(dirname: string) {
		useExpressServer(this.app, {
			cors: true,
			classTransformer: true,
			defaultErrorHandler: false,
			routePrefix: env.app.routePrefix,

			controllers: [dirname + "/controllers/*.ts"],
			middlewares: [dirname + "/core/middlewares/*.ts"],
			interceptors: [dirname + "/core/interceptors/*.ts"],
		});
	}

	configHealthRoute() {
		this.app.get("/health", (req: express.Request, res: express.Response) => {
			res.json({
				name: env.app.name,
				version: env.app.version,
				description: env.app.description,
			});
		});
	}

	configSwaggerRoute(dirname: string) {
		this.app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(getSwaggerSpec(dirname)))
	  }
}
