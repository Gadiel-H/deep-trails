"use strict";

import { toPathString } from "../../utils/public/index.js";
import type { Callback, Options, ParentContext, VisitLog } from "./index";
import type { EntriesIterator } from "../index";

/** @internal */
type IteratorFactory<T extends object, K = unknown, V = unknown> = (
    object: T
) => EntriesIterator<IteratorFactory<T, K, V>, T, K, V>;

/** `deepIterateCore` params object. @internal */
export type CoreParams<P extends object, K = any, V = any> = {
    /** The current parent node. */
    object: P;

    /** The context of the current parent.  */
    context: ParentContext<P, K>;

    /** The iterator for the current parent. */
    iterator: EntriesIterator<IteratorFactory<P, K, V>, P, K, V>;

    readonly callback: Callback<P, K, V>;

    readonly options: Options<P, K, V>;

    readonly visitLog: VisitLog<P, K> | null;

    readonly cbAlias: "The callback" | "options.callbackWrapper";

    /** Parent visit counter map. */
    readonly visitsCounter: Map<P, number>;

    readonly utils: Readonly<{
        finishedSymbol: symbol;

        toPathStringOptions: typeof toPathString.options;
    }>;
};
