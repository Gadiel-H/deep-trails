import type { ChildContext, ParentContext, Control, TraversalContext } from "./index";

/**
 * Callback for `deepIterate`.
 *
 * This is executed on each node before iterating over it.
 *
 * See {@linkcode TraversalContext} for the type of `this`.
 *
 * @remarks
 * - The return value is neither saved nor used.
 * - A synchronous callback is expected.
 *
 * @this {TraversalContext} Includes the received arguments, and opcionally, a visit log.
 * @param child - Context for the current child.
 * @param parent - Context for the current parent.
 * @param control - Includes flags and methods to control flow and structures.
 *
 * @returns Any value.
 *
 * @since 3.0.0
 */
export type Callback<P extends object, K = unknown, V = unknown, R extends P = P> = (
    this: TraversalContext<P, K, V, R>,
    child: ChildContext<P, K, V>,
    parent: Readonly<ParentContext<P, K, R>>,
    control: Control<V>
) => unknown;
