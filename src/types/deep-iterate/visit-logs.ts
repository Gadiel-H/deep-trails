import { ParentContext } from "./parent-context";

/**
 * Log of visited parent nodes in `deepIterate`.
 *
 * Its type varies depending on the value of `options.visitLogType`.
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
 */
export type VisitLog<P extends object, K = unknown> =
    | VisitLogMap<P, K>
    | VisitLogSet<P>
    | VisitLogArray<P, K>;

/**
 * Visit log of as a Map or a WeakMap.
 * Includes object references as keys, and context objects as values.
 */
export type VisitLogMap<P extends object, K = unknown> =
    | Map<P, ParentContext<P, K>[]>
    | WeakMap<P, ParentContext<P, K>[]>;

/**
 * Vist log as a Set or a WeakSet of object references of parents.
 */
export type VisitLogSet<P extends object> = Set<P> | WeakSet<P>;

/**
 * Visit log as an array of parent contexts.
 */
export type VisitLogArray<P extends object, K = unknown> = ParentContext<P, K>[];
