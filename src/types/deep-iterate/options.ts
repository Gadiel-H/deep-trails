import type { Callback } from "./index";
import { utils } from "../../index.js";

/**
 * Options parameter for `deepIterate`.
 *
 * The default options are in `deepIterate.options`.
 *
 * Notes:
 * - This object is cloned before start the deep iteration.
 *
 * @since 3.0.0-beta.0
 */
export type Options<P extends object, K = unknown, V = unknown> = {
    /**
     * Indicates whether should iterating node keys.
     *
     * The root node has no key.
     */
    iterateKeys: boolean;

    /**
     * Indicates whether should iterating node values.
     *
     * This does not apply to the root node.
     */
    iterateValues: boolean;

    /**
     * The type in which the path is created.
     *
     * If "string", `utils.toPathString` will be used.
     * Otherwise, the path will be an array of the found keys.
     *
     * @see {@linkcode utils.toPathString} for more details.
     */
    pathType: "array" | "string";

    /**
     * Optional callback wrapper.
     *
     * If it is a function, it will replace the callback.
     * It can access the original callback using `this.callback`.
     */
    callbackWrapper: null | Callback<P, K, V>;

    /**
     * Maximum number of visits per parent node, including the root.
     */
    maxParentVisits: number;

    /**
     * Type of the visit log for parent nodes.
     * - `"set"` or `"weakset"`: Saves unique object references.
     * - `"map"` or `"weakmap"`: Saves entries. Key: object reference. Value: history of contexts of that object.
     * - `"array"`: Saves contexts in the order in which the parent nodes are visited.
     * - `"null"`: There is not visit log.
     */
    visitLogType: "set" | "map" | "array" | "weakset" | "weakmap" | "null";

    /**
     * Indicates whether `callback` or `options.callbackWrapper` can access the visit log.
     */
    exposeVisitLog: boolean;
};
