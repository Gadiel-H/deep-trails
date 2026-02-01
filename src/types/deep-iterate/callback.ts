import type { ChildContext, ParentContext, Control, Options, VisitLog } from "./index";

/**
 * Callback for `deepIterate`.
 *
 * This is executed on each node before iterating over it.
 *
 * Notes:
 * - The return value is neither saved nor used.
 * - A synchronous callback is expected.
 *
 * @this {CallbackThis} Includes the received arguments, and opcionally, a visit log.
 * @param child - Information about the current child.
 * @param parent - Information about the current parent.
 * @param control - Controls iteration behavior for the node and its parent.
 *
 * @returns Any value.
 *
 * @since 3.0.0-beta.0
 */
export type Callback<P extends object, K = unknown, V = unknown, R extends P = any> = (
    this: CallbackThis<R, K, V, P>,
    child: ChildContext<P, K, V>,
    parent: Readonly<ParentContext<P, K>>,
    control: Control
) => unknown;

/**
 * `this` object bound to callbacks in `deepIterate`.
 *
 * Includes the received arguments and the visit log (if enabled).
 *
 * Two objects of this type are created in `deepIterate`:
 * - One is bound to the callback, and it may or may not include the visit log.
 * - The other one is the one that is returned at the end of the traverse, and it includes the visit log.
 *
 * @since 3.0.0-beta.0
 */
export type CallbackThis<
    R extends P,
    K = unknown,
    V = unknown,
    P extends object = object
> = Readonly<{
    /** The original root object passed to iterate it. */
    root: R;

    /** The original callback argument. */
    callback: Callback<P, K, V, R>;

    /**
     * A read-only copy of the original options argument.
     */
    options: Readonly<Options<P, K, V>>;

    /**
     * The optional visit log of parent nodes.
     *
     * - Is undefined in the callback if `options.exposeVisitLog` is falsy.
     * - Is null if `options.visitLogType` is `"null"`.
     * - It can always be accessed after finishing the traverse.
     */
    visitLog?: VisitLog<P, K> | null;
}>;
