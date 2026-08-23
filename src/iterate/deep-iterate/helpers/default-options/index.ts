"use strict";

import { type AnyOptions, validateExistence, setOption, getSafeValue } from "./helpers.js";

const optionsObject = Object.assign(Object.create(null), {
    iterateKeys: false,
    iterateValues: true,
    exposeVisitLog: true,
    pathType: "array",
    visitLogType: "null",
    onCircular: "skip-node",
    onGetter: "catch-error"
});

/** Default options argument for `deepIterate`. @internal */
export const defaultOptions = new Proxy<AnyOptions>(optionsObject, {
    set: (obj, key: PropertyKey, value: unknown) => {
        validateExistence(key);

        setOption(obj, key, value);

        return true;
    },
    deleteProperty: () => false,
    setPrototypeOf: () => false,
    defineProperty: (obj, key: PropertyKey, newDescriptor: Readonly<PropertyDescriptor>) => {
        if ("set" in newDescriptor || "get" in newDescriptor) {
            throw new TypeError(`Cannot set accessors for properties in deepIterate.options`);
        }

        validateExistence(key);

        const currentDesc = Reflect.getOwnPropertyDescriptor(obj, key)!;
        const desc = { ...currentDesc, ...newDescriptor };

        desc.value = getSafeValue(key, desc.value);
        Object.defineProperty(obj, key, desc);

        return true;
    }
});
