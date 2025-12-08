"use strict";

/** @internal */
export const objectCases = {
    Date: (obj: Date) => obj.toISOString(),
    RegExp: (obj: RegExp) => String(obj),

    WeakMap: () => "WeakMap { <items unknown> }",
    WeakSet: () => "WeakSet { <items unknown> }",

    Map: (obj: Map<any, any>) => {
        const { size } = obj;

        if (size === 0) return "Map(0) {}";
        return `Map(${size}) { ... }`;
    },

    Set: (obj: Set<any>) => {
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
        const length = obj.length;

        if (length === 0) return `${type}(0) []`;
        return `${type}(${length}) [ ... ]`;
    };
});
