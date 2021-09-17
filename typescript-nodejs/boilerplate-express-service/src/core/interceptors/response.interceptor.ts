import { Service as service} from "typedi";
import { Interceptor, InterceptorInterface, Action } from "routing-controllers";
import { Response } from "common-platform-express";

/**
 * Intercepts the responses and standardizes the format of the response
 * Format: status + data
 */
@Interceptor()
@service()
export class ResponseInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any) {
    return new Response<any>(content);
  }
}
