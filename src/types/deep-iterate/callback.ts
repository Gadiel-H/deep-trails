import type { ChildContext, ParentContext, Control, Options, VisitLog } from "./index";

/**
 * Callback for `deepIterate`.
 * This is executed on each node before iterating over it.
 *
 * @this {CallbackThis} The `this` object includes the parameters passed to deepIterate.
 * @param child - Information about the current child node.
 * @param parent - Information about the current parent node.
 * @param control - Controls iteration behavior for the node and its parent.
 * @returns Any value. The return is not saved.
 */
export type Callback<P extends object, K = unknown, V = unknown, R extends P = any> = (
    this: CallbackThis<R, K, V, P>,
    child: ChildContext<P, K, V>,
    parent: Readonly<ParentContext<P, K>>,
    control: Control
) => unknown;

/**
 * `this` object bound to callbacks in `deepIterate`.
 * This same object is returned at the end of the traverse.
 */
export type CallbackThis<R extends P, K = unknown, V = unknown, P extends object = object> = {
    /** The object passed to iterate it. */
    root: R;

    /** The original callback parameter. */
    callback: Callback<P, K, V, R>;

    /** The original options parameter. */
    options: Partial<Options<P, K, V>>;

    /**
     * The optional visit log of parent nodes.
     *
     * Is undefined if `options.exposeVisitLog` is falsy, or null if there is no visit log.
     * It can always be accessed after finishing the traverse.
     */
    visitLog?: VisitLog<P, K> | null;
};
