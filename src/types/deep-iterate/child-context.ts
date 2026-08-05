import type { Options } from "./index";

/**
 * Describes the success read of a child node's value during deep iteration.
 *
 * Read {@linkcode Options.onGetter} for more information.
 *
 * @since 3.0.0
 */
export type ChildValueRead<V> = {
    /**
     * The value of this child node.
     *
     * @remarks
     * - For objects and symbols, it is a reference.
     * - For other primitives, it is a copy.
     * - If it is an object, mutating it will affect the source structure.
     * - If `options.onGetter` is a function, it can intercept this value.
     */
    value: V;

    /**
     * It is `null` if there is not a synchronous getter error or if `options.onGetter` returns a value.
     */
    getterError: null;
};

/**
 * Describes the failed read of a child node's value during deep iteration.
 *
 * Read {@linkcode Options.onGetter} for more information.
 *
 * @since 3.0.0
 */
export type ChildValueError = {
    /**
     * It is `undefined` if a synchronous getter error is caught.
     */
    value: undefined;

    /**
     * It is an error if the getter throws one or if `options.onGetter` returns one.
     *
     * The `cause` property has the obtained error.
     */
    getterError: Error & { cause: unknown };
};

/**
 * Describes the base context of a child node during deep iteration.
 *
 * Provides metadata about the node's position and relationship within its parent.
 *
 * Read {@linkcode ChildContext} for the full context type.
 *
 * @since 3.0.0
 */
export type ChildBaseContext<P extends object, K = unknown> = {
    /** The key or identifier of this node within its parent. */
    key: K;

    /**
     * The path from the root node to this child.
     *
     * Its type varies depending on the value of {@linkcode Options.pathType options.pathType}.
     */
    path: string | Readonly<K[]>;

    /**
     * The zero-based index of this child within its parent.
     *
     * Indicates the discovery order, even for disordered structures.
     */
    index: number;

    /** The depth of this node in the structure, starting from the root at level 0. */
    depth: number;

    /**
     * A reference to the parent object of this child node.
     *
     * Mutating it will affect the source structure.
     */
    parentValue: P;
};

/**
 * Describes the context of a child node during deep iteration.
 *
 * Provides metadata about the node's position and relationship within its parent.
 *
 * Read {@linkcode Options.onGetter} to understand how the `getterError` property is set.
 *
 * @since 3.0.0
 */
export type ChildContext<P extends object, K = unknown, V = unknown> =
    (ChildBaseContext<P, K> & ChildValueRead<V>) | (ChildBaseContext<P, K> & ChildValueError);
