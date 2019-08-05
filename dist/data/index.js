import { getType, each } from '../common/common';
Date.prototype.format = (fmt) => fmt;
class DWrap {
    constructor(data) {
        this.data = data;
        this.type = getType(data);
    }
    each(callback) {
        const ctx = this.data;
        const type = this.type;
        const tactics = {
            Array() {
                let i = -1, len = ctx.length;
                while (++i < len) {
                    if (callback(ctx[i], i, ctx) === false)
                        return false;
                }
                return true;
            },
            Object() {
                for (let key in ctx) {
                    if (callback(ctx[key], key, ctx) === false) {
                        return false;
                    }
                }
                return true;
            },
            Number() {
                let i = -1;
                if (ctx < 1)
                    return false;
                while (++i < ctx) {
                    if (callback(i + 1, i, ctx) === false)
                        return false;
                }
                return true;
            },
            String() {
                let i = -1, len = ctx.length;
                while (++i < len) {
                    if (callback(ctx[i], i, ctx) === false)
                        return false;
                }
                return true;
            }
        };
        return tactics[type]();
    }
    /**
     * 判断是否为空对象或空数组
     */
    isEmpty() {
        return this.size() === 0;
    }
    size() {
        const ctx = this.data;
        const map = {
            Array() {
                return ctx.length;
            },
            Object() {
                let num = 0;
                for (const key in ctx) {
                    num++;
                }
                return num;
            }
        };
        return map[this.type]();
    }
    map(fn) {
        const ctx = this.data;
        const type = this.type;
        if (ctx instanceof Array) {
            return ctx.map(fn);
        }
        if (type === "String") {
            return ctx
                .split("")
                .map(fn)
                .join("");
        }
        if (type === 'Object') {
            const ret = {};
            each(ctx, (val, key) => {
                ret[key] = fn(val, key, ctx);
            });
            return ret;
        }
        return false;
    }
    deepCopy() {
        const ctx = this.data;
        const type = getType(ctx);
        function recursiveArr(arr) {
            const ret = [];
            each(arr, (val) => {
                const type = getType(val);
                if (type === 'Array') {
                    ret.push(recursiveArr(val));
                }
                else if (type === 'Object') {
                    ret.push(recursiveObj(val));
                }
                else {
                    ret.push(val);
                }
            });
            return ret;
        }
        function recursiveObj(obj) {
            const ret = {};
            each(obj, (val, key) => {
                const type = getType(val);
                if (type === 'Array') {
                    ret[key] = recursiveArr(val);
                }
                else if (type === 'Object') {
                    ret[key] = recursiveObj(val);
                }
                else {
                    ret[key] = val;
                }
            });
            return ret;
        }
        return type === 'Array' ? recursiveArr(ctx) : recursiveObj(ctx);
    }
    copy() {
        const ctx = this.data;
        if (this.type === 'Array') {
            return ctx.slice();
        }
        else if (this.type === 'Object') {
            const ret = {};
            each(ctx, (v, k) => ret[k] = v);
            return ret;
        }
        return ctx;
    }
    merge(mergeOrigin, keys, type = 'without') {
        const ctx = this.data;
        const mergeOriginType = getType(mergeOrigin);
        const mergeFn = (ctx, obj) => {
            each(ctx, (_, key) => {
                obj[key] !== undefined && (ctx[key] = obj[key]);
            });
        };
        const mergeFnWithKeys = (ctx, obj) => {
            const tactics = {
                within() {
                    if (keys === undefined)
                        return;
                    each(keys, (key) => {
                        obj[key] !== undefined && (ctx[key] = obj[key]);
                    });
                },
                without() {
                    if (keys === undefined)
                        return;
                    const withoutKeys = keys.reduce((pre, cur) => {
                        pre[cur] = true;
                        return pre;
                    }, {});
                    each(ctx, (_, key) => {
                        !withoutKeys[key] && obj[key] !== undefined && (ctx[key] = obj[key]);
                    });
                }
            };
            tactics[type]();
        };
        if (mergeOriginType === 'Object') {
            if (keys && keys.length) {
                mergeFnWithKeys(ctx, mergeOrigin);
            }
            else {
                mergeFn(ctx, mergeOrigin);
            }
            return;
        }
        if (mergeOriginType === 'Array') {
            if (keys && keys.length) {
                each(mergeOrigin, mergeItem => {
                    mergeFnWithKeys(ctx, mergeItem);
                });
            }
            else {
                each(mergeOrigin, mergeItem => {
                    mergeFn(ctx, mergeItem);
                });
            }
        }
    }
    /**
     * 序列化一个js对象
     * @param separator 序列化的连接符 默认值 '&
     * @returns {string} 返回一个字符串
     */
    serialize(separator = "&") {
        let ret = "";
        const ctx = this.data;
        each(ctx, (val, key) => {
            const value = val && typeof val === "object" ? JSON.stringify(val) : val;
            const group = `${key}=${value}${separator}`;
            ret += group;
        });
        return encodeURI(ret.slice(0, -1));
    }
    /**
    * 重置对象的值为0值
    * @param keys 字段集合
    * @param type 如果未without则排除keys里面的字段如果未within则只重置keys里面的相关字段的值
    */
    resetData(keys, type = 'without') {
        const ctx = this.data;
        const table = {
            Array: [],
            Object: {},
            Number: 0,
            String: ""
        };
        const arrType = getType(keys);
        if (keys === undefined || arrType !== 'Array') {
            each(ctx, (val, key) => {
                ctx[key] = table[getType(val)];
            });
            return;
        }
        let exist = {};
        keys.forEach(key => exist[key] = true);
        if (type === 'within') {
            return keys.forEach(key => {
                exist[key] && (ctx[key] = table[getType(ctx[key])]);
            });
        }
        each(ctx, (val, key) => {
            !exist[key] && (ctx[key] = table[getType(val)]);
        });
    }
    /**
    * 获取一个对象的所有的键
    */
    keys() {
        const ctx = this.data;
        if (!Object.keys) {
            const type = getType(ctx);
            const arr = [];
            type === 'Object' ? each(ctx, v => arr.push(v)) : each(ctx, (_, i) => arr.push(i + ''));
            return arr;
        }
        return Object.keys(ctx);
    }
    /**
     * 获取一个对象的所有值
     */
    values() {
        const ctx = this.data;
        if (!Object.values) {
            const arr = [];
            each(ctx, v => arr.push(v));
            return arr;
        }
        return Object.values(ctx);
    }
    /**
       * 尝试解析一个字符串
       * @param str 要解析的字符串
       * @param reviver 解析过程中的额外处理钩子
       */
    parse(str, reviver) {
        try {
            return JSON.parse(str, reviver);
        }
        catch (error) {
            return str;
        }
    }
    json(didParse = false, separator = '&') {
        const ctx = decodeURI(this.data.replace(/^\?+/, ''));
        const ret = {};
        ctx.split(separator).forEach(item => {
            const [key, val] = item.split('=');
            ret[key] = didParse ? this.parse(val) : val;
        });
        return ret;
    }
    repeat(num, joiner = '') {
        const ctx = this.data;
        if (num === undefined) {
            return ctx;
        }
        let i = 0, ret = '';
        while (i < num) {
            ret += ctx + joiner;
            i++;
        }
        return ret.replace(new RegExp(joiner + '$'), '');
    }
    /**
     * 添加数组
     * @param args 要添加的数组
     */
    add(...args) {
        let len = args.length;
        if (len < 1)
            return this.data;
        let ret = [], i = -1;
        while (++i < len) {
            getType(args[i]) !== "Array" ? ret.push(args[i]) : ret = ret.concat(args[i]);
        }
        return this.data.concat(ret);
    }
    findIndex(query, useBinarySearch) {
        if (useBinarySearch) {
            return this.binarySearch(query);
        }
        const ctx = this.data;
        const len = ctx.length;
        // query不为对象时
        if (typeof query !== 'object') {
            let i = 0;
            while (i < len) {
                if (query === ctx[i])
                    return i;
                i++;
            }
            return -1;
        }
        let i = -1;
        while (++i < len) {
            let isMatched = true;
            for (const key in query) {
                if (ctx[i][key] !== query[key])
                    isMatched = false;
                break;
            }
            if (isMatched)
                return i;
        }
        return -1;
    }
    has(query) {
        return this.findIndex(query) !== -1;
    }
    /**
     * 数组去重
     * @param key 复杂对象的字段,传入此参数则根据此参数的值进行去重
     */
    set(key) {
        if (this.type !== 'Array')
            throw new Error('data is not instance of Array');
        const ctx = this.data;
        if (Array.from && key === undefined) {
            return Array.from(new Set(ctx));
        }
        const obj = {};
        const arr = [];
        if (key === undefined) {
            each(ctx, (v) => {
                const key = typeof v + v;
                if (!obj[key]) {
                    obj[key] = true;
                    arr.push(v);
                }
            });
            return arr;
        }
        each(ctx, (v) => {
            const _key = v[key];
            if (!obj[_key]) {
                obj[_key] = true;
                arr.push(v);
            }
        });
        return arr;
    }
    /**
     * 二分查找
     * @param value 要查找的值
     * @param key 复杂数据的字段
     */
    binarySearch(value, key) {
        const ctx = this.data;
        let start = 0;
        let end = ctx.length - 1;
        function getMid() {
            return Math.floor((start + end) / 2);
        }
        let midIndex = getMid();
        if (key === undefined) {
            while (start <= end) {
                if (value > ctx[midIndex]) {
                    start = midIndex + 1;
                    midIndex = getMid();
                }
                else if (value < ctx[midIndex]) {
                    end = midIndex - 1;
                    midIndex = getMid();
                }
                else {
                    return midIndex;
                }
            }
            return -1;
        }
        while (start <= end) {
            if (value > ctx[midIndex][key]) {
                start = midIndex + 1;
                midIndex = getMid();
            }
            else if (value < ctx[midIndex][key]) {
                end = midIndex - 1;
                midIndex = getMid();
            }
            else {
                return midIndex;
            }
        }
        return -1;
    }
}
export default function wt(data) {
    return new DWrap(data);
}
