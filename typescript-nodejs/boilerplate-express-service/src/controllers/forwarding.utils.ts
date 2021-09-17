import {
  FileUpload,
  HttpClientService,
  Response,
  ErrorResponse,
  LogicalError,
} from "common-platform-express";

// TODO remove note when reviewed: implemented these functions here since we're going to use it only in the API gateway (no need to move it to common-service).

/**
 * Forwards the request to the service url provided and returns the response as it is
 * @param httpClient client to use to call the service
 * @param serviceUrl URL of the service that we need to call
 * @param req incoming request
 * @returns response body
 */
export async function forwardRequest<T>(
  httpClient: HttpClientService,
  serviceUrl: string,
  req: any
): Promise<T> {
  const response = await httpClient.sendHttpRequest<T>(
    {
      url: `${serviceUrl}${req.url.replace("/gateway", "")}`,
      method: req.method,
      responseType: "json",
      throwHttpErrors: false,
      searchParams: req.query,
      json: req.body,
    },
    req.headers.requestid
  );

  if (response.status === "success") return (<Response<T>>response).data;
  else {
    const error = (<ErrorResponse>response).error;
    throw new LogicalError(error.message);
  }
}

/**
 * Forward a form-data request to the service url provided and returns the response as it is
 * @param httpClient client to use to call the service
 * @param req incoming request
 * @param serviceUrl URL of the service that we need to call
 * @param jsonData incoming json data
 * @param files array of files having the key as the name of the file in form-data
 * @returns Response T
 */
export async function forwardFormDataRequest<T>(
  httpClient: HttpClientService,
  req: any,
  serviceUrl: string,
  jsonData: any,
  files: { [key: string]: FileUpload }
): Promise<T> {
  var FormData = require("form-data");
  var form = new FormData();

  for (const key of Object.keys(jsonData)) {
    form.append(key, jsonData[key]);
  }

  for (const key of Object.keys(files)) {
    form.append(key, files[key].buffer, files[key].originalname);
  }

  const response = await httpClient.sendHttpRequest<T>(
    {
      url: `${serviceUrl}${req.url.replace("/gateway", "")}`,
      method: "POST",
      responseType: "json",
      throwHttpErrors: false,
      body: form,
    },
    req.headers.requestid
  );

  if (response.status === "success") return (<Response<T>>response).data;
  else {
    const error = (<ErrorResponse>response).error;
    throw new Error(error.message);
  }
}
