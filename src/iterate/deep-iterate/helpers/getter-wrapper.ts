"use strict";

/** Silences the error */
const doNothing = () => {};

/** @internal */
export function getterWrapper<T extends object, V = unknown>(
    parentValue: T,
    get: Function
): { value: V } | { error: unknown } {
    try {
        const value = get.call(parentValue);

        if (value && value instanceof Promise) {
            value.catch(doNothing);
        }

        return { value };
    } catch (error) {
        return { error };
    }
}
