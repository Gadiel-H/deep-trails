"use strict";

import type { InvalidsList } from "../types/index";

/** Displays invalid properties by throwing a `TypeError`. @internal */
export function throwInvalids(
    invalidProperties: InvalidsList,
    totalProperties: number,
    title: string
): never {
    const len = invalidProperties.length;
    const invalidsStrings: string[] = [];

    let i = -1;
    while (++i < len) {
        const [path, type, value] = invalidProperties[i];
        const string = `${path}: ${type} = ${value}\n`;
        invalidsStrings[i] = string;
    }

    throw new TypeError(
        `${len} of ${totalProperties} ${title} are invalid.\n\n` +
            "<field>: <expected type> = <received value>\n\n\n" +
            `${invalidsStrings.join("\n")}`
    );
}
