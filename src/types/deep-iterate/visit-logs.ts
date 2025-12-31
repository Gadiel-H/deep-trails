import { ParentContext } from "./parent-context";

/**
 * Log of visited parent nodes generated in `deepIterate`.
 *
 * Its type varies depending on the value of
 * "{@link https://gadiel-h.github.io/deep-trails/types/DeepIterate.Options.html#visitlogtype visitLogType}"
 * in the options.
 *
 * Format in each structure:
 *
 * **Map and WeakMap**:
 * - Key: Object reference.
 * - Value: Context object.
 *
 * **Array**:
 * - Value: Context object.
 *
 * **Set and WeakSet**:
 * - Value: Object reference.
 *
 * @since 3.0.0-beta.0
 */
export type VisitLog<P extends object, K = unknown> =
    | VisitLogMap<P, K>
    | VisitLogSet<P>
    | VisitLogArray<P, K>;

/**
 * Visit log of as a Map or a WeakMap.
 * Includes parent objects as keys, and context  as values.
 * @since 3.0.0-beta.0
 */
export type VisitLogMap<P extends object, K = unknown> =
    | Map<P, ParentContext<P, K>[]>
    | WeakMap<P, ParentContext<P, K>[]>;

/**
 * Visit log as a Set or a WeakSet of parent objects.
 * @since 3.0.0-beta.0
 */
export type VisitLogSet<P extends object> = Set<P> | WeakSet<P>;

/**
 * Visit log as an array of parent contexts.
 * @since 3.0.0-beta.0
 */
export type VisitLogArray<P extends object, K = unknown> = ParentContext<P, K>[];
