import type { Callback, Options, VisitLog } from "./index";

/**
 * Readonly object containing the arguments given to
 * `deepIterate`, and a visit log if one was generated.
 *
 * @remarks
 * Two objects of this type are created after the traverse:
 * - One is bound to the callback, and it may or may not include the visit log according to `options.exposeVisitLog`.
 * - The other one is returned at the end of the traverse, and it always includes the visit log if available.
 * - In both objects, the read-only copy of the options is the same.
 *
 * @since 3.0.0-beta.3
 */
export type Snapshot<R extends P, K = unknown, V = unknown, P extends object = object> = Readonly<{
    /** The original root object passed to iterate it. */
    root: R;

    /** The original callback argument. */
    callback: Callback<P, K, V, R>;

    /**
     * A read-only copy of the received options filled with the default options.
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
