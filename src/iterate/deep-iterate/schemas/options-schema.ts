"use strict";

import { recordSchema, validators } from "../../../__schemas/index.js";
import type { Options } from "../../../types/deep-iterate/index";

const { string, boolean, anyFunction, typeUnion } = validators;

const checkBoolean = boolean();

/** deepIterate options schema. @internal */
export const optionsSchema = recordSchema<Options<object>>({
    iterateKeys: checkBoolean,
    iterateValues: checkBoolean,
    exposeVisitLog: checkBoolean,
    onCircular: typeUnion([string(["skip-node", "throw-error"]) as any, anyFunction()]) as any,
    pathType: string(["array", "string"]),
    visitLogType: string(["set", "map", "array", "weakset", "weakmap", "null"])
});
