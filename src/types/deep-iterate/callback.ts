import type { ChildContext, ParentContext, Control, Snapshot } from "./index";

/**
 * Callback for `deepIterate`.
 *
 * This is executed on each node before iterating over it.
 *
 * Notes:
 * - The return value is neither saved nor used.
 * - A synchronous callback is expected.
 *
 * @this {Snapshot} Includes the received arguments, and opcionally, a visit log.
 * @param child - Information about the current child.
 * @param parent - Information about the current parent.
 * @param control - Controls iteration behavior for the node and its parent.
 *
 * @returns Any value.
 *
 * @since 3.0.0-beta.3
 */
export type Callback<P extends object, K = unknown, V = unknown, R extends P = any> = (
    this: Snapshot<R, K, V, P>,
    child: ChildContext<P, K, V>,
    parent: Readonly<ParentContext<P, K>>,
    control: Control
) => unknown;
