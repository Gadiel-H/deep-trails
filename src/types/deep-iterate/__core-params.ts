"use strict";

import { toPathString } from "../../utils/public/index.js";
import type { Callback, Options, ParentContext, VisitLog, LightEntriesIterator } from "./index";

/** `deepIterateCore` params object. @internal */
export type CoreParams<P extends object, K = any, V = any, R extends P = P> = {
    /** The current parent node. */
    object: P;

    /** The context of the current parent.  */
    context: ParentContext<P, K>;

    /** The iterator for the current parent. */
    iterator: LightEntriesIterator;

    readonly callback: Callback<P, K, V, R>;

    readonly options: Options<P, K, V>;

    readonly visitLog: VisitLog<P, K, R> | null;

    readonly cbAlias: "The callback";

    /** Parent visit counter map. */
    readonly visitsCounter: Map<P, number>;

    readonly utils: Readonly<{
        finishedSymbol: symbol;

        toPathStringOptions: {
            notation: typeof toPathString.notation;
            extraKey?: unknown;
        };
    }>;
};
