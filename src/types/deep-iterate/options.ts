import type { ChildBaseContext, ParentContext } from "./index";
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
     * Specify what to do when a circular reference is found.
     *
     * `Function`: receives the current context of the node.
     * - It must return `"iterate"` to iterate it.
     * - Otherwise, it will be skipped.
     * - It can also throw anything and it won't be caught.
     *
     * `"skip-node"`: the node will be skipped and the iteration will continue.
     *
     * `"throw-error"`: an error will be thrown with the path of the node.
     */
    onCircular:
        | "skip-node"
        | "throw-error"
        | ((
              this: Readonly<Options<P, K, V>>,
              context: Readonly<ParentContext<P, K>>
          ) => "skip" | "iterate");

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

    /**
     * Specify what to do when a getter is found.
     *
     * `Function`: receives the context of the node and its property descriptor.
     * - If returns an error, it will be stored in `getterError.cause`.
     * - If returns a value, that will be the value in the context.
     * - If throws any value, it will not be caught and the traversal will stop.
     *
     * `"execute"`: reads the property without any protection.
     *
     * `"catch-error"`: catches the error if one is thrown.
     * - If the getter returns a promise, the `catch` method will be called with an empty callback.
     * - If the getter throws any value, it will be stored in `getterError.cause`.
     *
     * @remarks Getters are only detected when iterating over properties (not in `.entries()` iterators).
     *
     * @example
     * deepIterate(
     *     ArrayBuffer.prototype,
     *     ({ path, getterError }) => console.log({ path, getterError }),
     *     {
     *         onGetter({ parentValue }, { get }) {
     *            try {
     *                return { value: get.call(parentValue) };
     *            } catch (error) {
     *                return { error };
     *            }
     *         }
     *     }
     * );
     */
    onGetter:
        | "execute"
        | "catch-error"
        | ((
              this: Readonly<Options<P, K, V>>,
              /** The base context of the node. */
              node: Readonly<ChildBaseContext<P, K>>,
              /** The property descriptor with a getter. */
              descriptor: PropertyDescriptor & { get: Function }
          ) => { value: V } | { error: unknown });
};
