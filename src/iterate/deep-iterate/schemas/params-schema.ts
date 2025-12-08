"use strict";

import { checkers } from "../../../utils/public/index.js";
import { recordSchema, validators } from "../../../__schemas/index.js";
import { optionsSchema } from "./options-schema.js";

const { anyFunction } = validators;

/** deepIterate parameter schema. @internal */
export const paramsSchema = recordSchema<{
    object: object;
    callback: Function;
    options: object;
}>({
    object: {
        __test: checkers.isObject,
        __type: "object"
    },
    callback: anyFunction(),
    options: {
        __test: checkers.isPlainObject,
        __type: "DeepIterate.Options",
        __subSchema: optionsSchema
    }
});
