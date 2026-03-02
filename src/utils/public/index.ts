import * as _checkers from "./checkers/index.js";
export { typeOf } from "./type-of.js";
export * from "./checkers/index.js";
export * from "./to-string/index.js";

/**
 * Object with some util type checkers.
 *
 * @remarks
 * **It will be removed in stable version 3.0.0.**
 * You can migrate by importing them from `utils` or "deep-trails/utils".
 *
 * @deprecated
 *
 * @since 3.0.0-beta.0
 */
export const checkers = new Proxy(_checkers, {
    get(object, key) {
        if (typeof key === "string" && key.startsWith("is")) {
            if (key === "isInteger") {
                console.warn(
                    `deep-trails: isInteger will be removed in v3.0.0. Use isIntegerLike from "deep-trails/utils" instead.`
                );
            } else {
                console.warn(
                    `deep-trails: The checkers object will be removed in v3.0.0. Import ${String(key)} from "deep-trails/utils" instead.`
                );
            }
        }

        return object[key];
    }
});
