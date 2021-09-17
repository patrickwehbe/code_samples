import { IsLowercase } from "class-validator";
import { LogicalError } from "common-platform-express";
import { Value } from "../../models";

export class ValueResponse {
  /**
   * _key of value in database
   */
  id: string;

  /**
   * Name of Value
   */
  @IsLowercase()
  name: string;

  /**
   * Description of value
   */
  description: string;

  fileUrl?: string;

  public static getValueResponse(value: Value): ValueResponse {
    if (!value._key)
      throw new LogicalError("Something wrong with the value's key");

    return {
      id: value._key,
      name: value.name,
      description: value.description,
      fileUrl: value.fileInfo && value.fileInfo.url,
    };
  }

  public static getValueResponseList(values: Value[]): ValueResponse[] {
    let valueResponseList: ValueResponse[] = [];

    for (const value of values) {
      valueResponseList.push(ValueResponse.getValueResponse(value));
    }

    return valueResponseList;
  }
}
