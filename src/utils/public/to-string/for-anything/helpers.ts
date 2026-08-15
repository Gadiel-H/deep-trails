"use strict";

import { isArrayLike } from "../../index.js";

const { toString } = Object.prototype;

/** @internal */
export const objectCases = {
    Date: (obj: Date) => {
        if (!(obj instanceof Date)) return toString.call(obj);

        const time = obj.getTime();

        return time !== time ? "Invalid Date" : obj.toISOString();
    },
    RegExp: (obj: RegExp) => {
        if (obj instanceof RegExp) return String(obj);

        return toString.call(obj);
    },

    WeakMap: (obj: WeakMap<any, any>) => {
        if (!(obj instanceof WeakMap)) return toString.call(obj);

        return "WeakMap { <items unknown> }";
    },
    WeakSet: (obj: WeakSet<any>) => {
        if (!(obj instanceof WeakSet)) return toString.call(obj);

        return "WeakSet { <items unknown> }";
    },

    Map: (obj: Map<any, any>) => {
        if (!(obj instanceof Map)) {
            return toString.call(obj);
        }

        const { size } = obj;

        if (size === 0) return "Map(0) {}";
        return `Map(${size}) { ... }`;
    },

    Set: (obj: Set<any>) => {
        if (!(obj instanceof Set)) {
            return toString.call(obj);
        }

        const { size } = obj;

        if (size === 0) return "Set(0) {}";
        return `Set(${size}) { ... }`;
    }
};

/** Known ArrayLike object types. */
const arrayLikes = [
    "Array",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Uint16Array",
    "Int32Array",
    "Uint32Array",
    "Float32Array",
    "Float64Array",
    "BigInt64Array",
    "BigUint64Array",
    "NodeList",
    "HTMLCollection"
] as const;

arrayLikes.forEach((type: (typeof arrayLikes)[number]) => {
    objectCases[type] = (obj: ArrayLike<any>) => {
        if (!isArrayLike(obj)) return toString.call(obj);

        const length = obj.length;

        if (length === 0) return `${type}(0) []`;
        return `${type}(${length}) [ ... ]`;
    };
});
