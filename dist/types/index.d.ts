export declare type Obj = Record<string, any>;
export declare type Arr = any[];
export declare type ExcludeObj = string | number | boolean | null | undefined;
export interface Tactics<T> {
    [key: string]: () => T;
}
