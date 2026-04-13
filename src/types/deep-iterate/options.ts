import type { ParentContext } from "./index";
import { toPathString } from "../../utils/public/index.js";
import { deepIterate } from "../../iterate/index.js";

/**
 * Options parameter for `deepIterate`.
 *
 * The default options are in {@linkcode deepIterate.options}.
 *
 * Notes:
 * - This object is cloned before start the deep iteration.
 *
 * @since 3.0.0
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
     * If "string", {@linkcode toPathString} will be used in mixed notation.
     * Otherwise, the path will be an array of the found keys.
     */
    pathType: "array" | "string";

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
     * Indicates whether the callback can access the visit log.
     */
    exposeVisitLog: boolean;
};
