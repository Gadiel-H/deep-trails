/**
 * Describes the context of a parent node during deep iteration.
 *
 * Provides metadata about the node's position, ancestry, and traversal state.
 *
 * @since 3.0.0-beta.0
 */
export type ParentContext<P extends object, K = unknown> = {
    /**
     * The key identifying this parent within its own parent.
     *
     * It is null if this node is the root.
     */
    key: K | null;

    /**
     * The value of this parent node.
     *
     * It is the same as the key if its role is "key".
     */
    value: P;

    /**
     * Path from the root to this parent node.
     *
     * Its type varies depending on the value of
     * "{@link https://gadiel-h.github.io/deep-trails/types/DeepIterate.Options.html#pathtype pathType}"
     * in the options.
     */
    path: string | Readonly<K[]>;

    /**
     * The zero-based index of this parent within its own parent.
     * It is **-1** for the **root** node.
     *
     * Indicates the discovery order, even for disordered structures.
     */
    index: number;

    /**
     * Depth of this parent in the tree, starting from root at 0.
     */
    depth: number;

    /**
     * Total number of children that have been counted for this parent.
     *
     * It is undefined if the number of children is not known.
     */
    size: number | undefined;

    /**
     * Indicates whether this parent's value is the key or value of the node, or the root node.
     */
    role: "key" | "value" | "root";

    /**
     * Number of times this parent's value has been visited on the deep iteration.
     */
    visits: number;

    /**
     * The value of the current grandparent, or null if this parent is the root node.
     */
    parentValue: P | null;
};
