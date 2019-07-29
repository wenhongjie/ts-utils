import { Obj } from '../types/index';
declare class WStore {
    storage: Obj;
    constructor(type?: string);
    get(key?: string, didParse?: boolean): any;
    set(key: string, value: any): WStore;
    set(obj: Obj): WStore;
    remove(item: string): void;
    clear(): void;
}
declare class Cookie {
    initialized: boolean;
    cookie: Obj;
    constructor();
    private _update;
    private init;
    get(key?: string): any;
    set(...args: any[]): void;
    remove(...args: string[]): void;
}
interface Cache {
    tactics: Obj;
    [key: string]: any;
    create(type: string): WStore | Cookie;
}
declare const cache: Cache;
export default cache;
