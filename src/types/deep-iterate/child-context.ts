/**
 * Describes the context of a child node during deep iteration.
 *
 * Provides metadata about the node's position and relationship within its parent.
 *
 * @since 3.0.0-beta.0
 */
export type ChildContext<P extends object, K = unknown, V = unknown> = {
    /** The key or identifier of this node within its parent. */
    key: K;

    /** The value of this child node. */
    value: V;

    /**
     * The path from the root node to this child.
     *
     * Its type varies depending on the value of
     * "{@link https://gadiel-h.github.io/deep-trails/types/DeepIterate.Options.html#pathtype pathType}"
     * in the options.
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

    /** The value of the current parent node. */
    parentValue: P;
};
