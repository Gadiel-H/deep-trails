import type { VisitLogSet, VisitLogMap, VisitLogArray } from "../../../types/deep-iterate/index";

/** @internal */
export const createLog = {
    set: () => new Set() as VisitLogSet<any>,
    map: () => new Map() as VisitLogMap<any, any>,
    weakset: () => new WeakSet() as VisitLogSet<any>,
    weakmap: () => new WeakMap() as VisitLogMap<any, any>,
    array: () => [] as VisitLogArray<any, any>,
    null: () => null
};
