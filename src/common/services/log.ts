import Logger, { createLogger } from "bunyan";
import dotenv from "dotenv";
import { errSerializer, resSerializer, createRequestSerializer } from "@app/data/util";

dotenv.config();

export const Log: Logger = createLogger({
  name: process.env.service_name,
  serializers: {
    err: errSerializer,
    res: resSerializer,
    req: createRequestSerializer("password")
  }
});
