"use strict";

import { toSimpleString } from "../index.js";

/** @internal */
export const dotNotation = /^[a-zA-Z_$][\w$]*$/;

/** @internal */
export const strKeyWithBrackets = (key: unknown) => `[${toSimpleString(key)}]`;

/** @internal */
export const strKeyWithDots = (key: unknown, index: number) => {
    if (typeof key === "string" && dotNotation.test(key)) {
        return index > 0 ? `.${key}` : key;
    }

    return `[${toSimpleString(key)}]`;
};

/** @inline @internal */
export type Notation = "mixed" | "bracket";

/** @inline @internal */
export type OptionsArgument = {
    /** The notation in which the path and/or the extra key string will be created. */
    notation?: Notation;
    /** Optional extra key to append to the path string. */
    extraKey?: unknown;
};
