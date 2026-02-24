import type { Callback, ParentContext } from "./index";
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
     *
     * It can access the original callback using `this.callback`.
     *
     * @deprecated
     * Deprecated since 3.0.0-beta.3 because it can abuse the original
     * callback or simply not use it correctly and cause problems.
     *
     * It will be removed in version 3.0.0
     */
    callbackWrapper: null | Callback<P, K, V>;

    /**
     * Maximum number of visits per parent node, including the root.
     *
     * @deprecated since 3.0.0-beta.3
     *
     * **Keep in mind:**
     * - This option will be removed in v3.0.0
     * - From now on, the new option, "onCircular", will be interpreted before this one
     * - Both options serve to avoid iterating circular structures, but "onCircular" is more flexible
     * - Use the new option instead
     */
    maxParentVisits: number;

    /**
     * Specify what to do when a circular reference to a parent object is found.
     *
     * **Cases:**
     *
     * If it's a function, receives the context of the parent.
     * - Its return will be treated as boolean to check whether should iterate it again or not.
     * - It can also throw an error and it will not be caught.
     *
     * If it's "skip-node", the circular node will be skipped and the iteration will continue.
     *
     * If it's "throw-error", an error will be thrown with the path of the circular node.
     *
     * @since 3.0.0-beta.3
     */
    onCircular:
        | "skip-node"
        | "throw-error"
        | ((
              this: Readonly<Options<P, K, V>>,
              context: Readonly<ParentContext<P, K>>
          ) => boolean | void | never);

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
