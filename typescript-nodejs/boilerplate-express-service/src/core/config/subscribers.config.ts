import { ILogger, AMQPService} from "common-platform-express";
import glob from "glob";
import Container from "typedi";

/**
 * Registers subscribers
 */
export const registerSubscribers = (dirname: string, logger: ILogger) => {
  const pattern = dirname + "/subscribers/*.subscriber.ts";
  const messageBusService = Container.get(AMQPService);

  glob(pattern, (err: any, files: string[]) => {
    for (const file of files) {
      createInstance(file, messageBusService, logger);
    }
  });
};

/**
 * Creates an instance of the class contained in the filepath provided
 * @param {string} file path to the file containing the class to create an instance of
 * @param args args to pass to the class
 * @returns instance of the class created
 */
const createInstance = (file: string, messageBusService, logger) => {
  // Require Subscriber File
  const instance = require(file);

  // Get constructor Name
  const constructorName = Object.keys(instance)[0];

  // Get Constructor Params
  const constructorParams = <Array<any>>(
    Reflect.getMetadata("design:paramtypes", instance[constructorName])
  );

  let params = [];

  // Loop over params and for the ones that end with Repository, get their values from typeDi (already injected)
  for (const param of constructorParams) {
    if (param.name.endsWith("Repository")) params.push(Container.get(param));
  }

  // Create instance and return it
  return new instance[constructorName](messageBusService, logger, ...params);
};
