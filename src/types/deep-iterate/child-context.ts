/**
 * Describes the context of a child node during deep iteration.
 * Provides metadata about the node's position and relationship within its parent.
 */
export type ChildContext<P extends object, K = unknown, V = unknown> = {
    /** The key or identifier of this node within its parent. */
    key: K;

    /** The value of this child node. */
    value: V;

    /** The path from the root node to this child, as a string or array of keys. */
    path: string | Readonly<K[]>;

    /** The zero-based index of this child within its parent. */
    index: number;

    /** The depth of this node in the structure, starting from the root at level 0. */
    depth: number;

    /** The value of the current parent node. */
    parentValue: P;
};
