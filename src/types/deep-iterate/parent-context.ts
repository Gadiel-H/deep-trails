import type { Options } from "./index";

/**
 * Describes the context of the root or any parent node during deep iteration.
 *
 * See {@linkcode SubParentContext} for the description of the properties.
 *
 * @since 3.0.0
 */
export type ParentContext<P extends object, K = unknown, R extends P = P> =
    SubParentContext<P, K> | RootContext<R>;

/**
 * Describes the context of a parent node during deep iteration.
 *
 * Provides metadata about its position, ancestry, and traversal state.
 *
 * @since 3.0.0
 */
export type SubParentContext<P extends object, K = unknown> = {
    /**
     * A reference to the parent object.
     *
     * It is the same as the key if the role is "key"
     * or if it is an element of a Set.
     *
     * Mutating it will affect the source structure.
     */
    value: P;

    /**
     * Path from the root to this parent.
     *
     * Its type varies depending on the value of {@linkcode Options.pathType options.pathType}.
     */
    path: string | Readonly<K[]>;

    /**
     * The zero-based index of this parent within its own parent.
     *
     * Indicates the discovery order, even for disordered structures.
     */
    index: number;

    /**
     * Depth of this parent in the structure, starting from root at 0.
     */
    depth: number;

    /**
     * Total number of children that have been counted for this parent.
     *
     * It is undefined when it is not known.
     */
    size: number | undefined;

    /**
     * Number of times this parent object has been visited on the deep iteration.
     *
     * It is always greater than or equal to 1.
     */
    visits: number;

    /**
     * A reference to the parent object of this parent.
     *
     * Mutating it will affect the source structure.
     */
    parentValue: P;
} & (
    | {
          /**
           * The key identifying this parent within its own parent.
           *
           * It is of type `K` (key) when the role is "value".
           */
          key: K;

          /**
           * It is "value" when this parent object is the value of its node.
           */
          role: "value";
      }
    | {
          /**
           *
           * It is of type `P` (parent object) when the role is "key".
           */
          key: P;

          /**
           *
           * It is "key" when this parent object is the key of its node.
           */
          role: "key";
      }
);

/**
 * Describes the context of the root node in the iteration.
 *
 * @since 3.0.0
 */
export type RootContext<R extends object> = {
    /**
     *
     * It is null in the root context.
     */
    key: null;

    /**
     *
     * It is the root object when the role is "root".
     */
    value: R;

    /**
     *
     * It is an empty path in the root context.
     */
    path: "" | Readonly<[]>;

    /**
     *
     * It is -1 in the root context.
     */
    index: -1;

    /**
     *
     * It is 0 in the root context.
     */
    depth: 0;

    /**
     * Total number of children that have been counted for this parent.
     *
     * It is undefined when it is not known.
     */
    size: number | undefined;

    /**
     *
     * It is "root" in the root context.
     */
    role: "root";

    /**
     *
     * It is 1 in the root context.
     */
    visits: 1;

    /**
     *
     * It is null in the root context.
     */
    parentValue: null;
};
