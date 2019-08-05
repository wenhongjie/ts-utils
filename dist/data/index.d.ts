import { Obj, Arr, ExcludeObj } from '../types/index';
declare global {
    interface Date {
        format(fmt: string): string;
    }
}
declare class DWrap {
    readonly data: any;
    type: string;
    constructor(data: any);
    /**
    * 循环数组
    * @param callback 每次循环的回调函数
    */
    each(callback: (value: any, index: number, ctx: Arr) => any): boolean;
    /**
     * 循环对象
     * @param callback 每次循环的回调函数
     */
    each(callback: (value: any, key: string, ctx: Obj) => any): boolean;
    /**
     * 循环字符串
     * @param callback 每次循环的回调函数
     */
    each(callback: (value: any, index: string, ctx: string) => any): boolean;
    /**
     * 循环num, num为多少则代表循环多少次
     * @param callback 每次循环的回调函数
     */
    each(callback: (value: number, ticks: number, ctx: number) => any): boolean;
    /**
     * 判断是否为空对象或空数组
     */
    isEmpty(): boolean;
    size(): number;
    /**
     * 获得一个字符串的映射值
     * @param fn 映射的处理回调
     * @returns {string} 返回一个字符串
     */
    map<S extends string>(fn: (value: S, key: number, ctx: S) => S): S;
    /**
     * 获得一个数组的映射值
     * @param fn 映射的处理回调
     * @returns {array} 返回一个映射后的数组
     */
    map(fn: (value: any, index: number, ctx: Arr) => any): Arr;
    /**
     * 获得一个对象的映射
     * @param fn 映射的处理回调
     * @returns {object} 返回一个对象
     */
    map(fn: (value: any, key: string, ctx: Obj) => any): Obj;
    deepCopy(): Obj | Arr;
    copy(): any;
    merge(mergeOrigin: Obj[] | Obj, keys?: string[], type?: 'without' | 'within'): void;
    /**
     * 序列化一个js对象
     * @param separator 序列化的连接符 默认值 '&
     * @returns {string} 返回一个字符串
     */
    serialize(separator?: string): string;
    /**
    * 重置对象的值为0值
    * @param keys 字段集合
    * @param type 如果未without则排除keys里面的字段如果未within则只重置keys里面的相关字段的值
    */
    resetData(keys?: string[], type?: string): void;
    /**
    * 获取一个对象的所有的键
    */
    keys(): Arr;
    /**
     * 获取一个对象的所有值
     */
    values(): Arr;
    /**
       * 尝试解析一个字符串
       * @param str 要解析的字符串
       * @param reviver 解析过程中的额外处理钩子
       */
    parse(str: string, reviver?: (this: any, key: string, value: any) => any): string;
    json(didParse?: boolean, separator?: string): Obj;
    repeat(num: number, joiner?: string): string;
    /**
     * 添加数组
     * @param args 要添加的数组
     */
    add(...args: any[]): Arr;
    /**
     * 查找元素的索引
     * @param query 查询参数
     * @param useBinarySearch 是否启用二分查找(前提是有序的数组)
     */
    findIndex(query: ExcludeObj, useBinarySearch?: boolean): number;
    /**
     * 查找复杂元素的索引
     * @param query 查询参数
     */
    findIndex(query: Obj): number;
    has(query: ExcludeObj): boolean;
    has(query: Obj): boolean;
    /**
     * 数组去重
     * @param key 复杂对象的字段,传入此参数则根据此参数的值进行去重
     */
    set<T>(key?: string): T[];
    /**
     * 二分查找
     * @param value 要查找的值
     * @param key 复杂数据的字段
     */
    binarySearch(value: number | string, key?: string): number;
}
export default function wt(data: any): DWrap;
export {};
