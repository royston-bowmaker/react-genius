import * as React from "react";
import { HashTable } from "../library/Language/Types/Objects";

let geniusStore: any;

declare global {
    interface Window { Genius: any; }
}

export class Storage {

    static initialize() {
        if (geniusStore) {
            throw new Error("Cannot Reinitialize Genius Storage!");
        }
        geniusStore = React.useRef({});
    }

    static set(key: string[], value: any, ns?: string[]) {
        this.checkStoreExists();
        let nsKey = this.nsId(ns, key);
        HashTable.set(geniusStore.current, nsKey, value);
    }

    static get(key: string[], ns?: string[]): any {
        this.checkStoreExists();
        let nsKey = this.nsId(ns, key);
        return HashTable.get(geniusStore.current, nsKey);
    }

    static exists(key: string[], ns?: string[]): boolean | null | undefined {
        this.checkStoreExists();
        let nsKey = this.nsId(ns, key);
        return HashTable.exists(geniusStore.current, nsKey);
    }

    private static nsId(ns: string[] | undefined, identifier: string[]): string[] {
        if (!ns) {
            return identifier;
        }
        return [...ns as string[], ...identifier];
    }

    private static checkStoreExists() {
        if (!geniusStore) {
            throw new Error("Genius Store Needs To Be Initialized!");
        }
    }

};