import { Obj, Arr } from '../types/index';
declare type ObjCb = (val: any, key: string, target: Obj) => void;
declare type ArrCb = (val: any, index: number, target: Obj) => void;
export declare const getType: (value: any) => string;
/**
 * 遍历数组并执行传入的回调函数
 * @param arr 目标数组
 * @param cb 回调函数
 */
export declare function each(arr: Arr, cb: ArrCb): void;
/**
 * 遍历对象并执行传入的回调函数
 * @param obj 目标对象
 * @param cb 回调函数
 */
export declare function each(obj: Obj, cb: ObjCb): void;
export declare function serialize(data: Obj): string;
export declare function json(queryString: string): any;
export {};
