"use strict";

/** Silences the error */
const doNothing = () => {};

/** @internal */
export function getterWrapper(
    { parentValue }: { parentValue: object },
    { get }: { get: Function }
) {
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
