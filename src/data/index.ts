import { getType, each } from '../common/common'
import { Obj, Arr, Tactics, ExcludeObj } from '../types/index'

class DWrap {

  readonly data: any;

  public type: string;

  constructor(data: any) {
    this.data = data
    this.type = getType(data)
  }

  /**
  * 循环数组
  * @param callback 每次循环的回调函数
  */
  each(callback: (value: any, index: number, ctx: Arr) => any): boolean
  /**
   * 循环对象
   * @param callback 每次循环的回调函数
   */
  each(callback: (value: any, key: string, ctx: Obj) => any): boolean
  /**
   * 循环字符串
   * @param callback 每次循环的回调函数
   */
  each(callback: (value: any, index: string, ctx: string) => any): boolean
  /**
   * 循环num, num为多少则代表循环多少次
   * @param callback 每次循环的回调函数
   */
  each(callback: (value: number, ticks: number, ctx: number) => any): boolean
  each(callback: (value: any, index: any, ctx: any) => any): boolean {
    const ctx = this.data
    const type = this.type

    const tactics: Tactics<boolean> = {
      Array() {
        let i = -1, len = ctx.length
        while (++i < len) {
          if (callback(ctx[i], i, ctx) === false) return false
        }
        return true
      },
      Object() {
        for (let key in ctx) {
          if (
            callback(ctx[key], key, ctx) === false
          ) {
            return false
          }
        }
        return true
      },
      Number() {
        let i = -1
        if (ctx < 1) return false

        while (++i < ctx) {
          if (callback(i + 1, i, ctx) === false) return false
        }
        return true
      },
      String() {
        let i = -1, len = ctx.length
        while (++i < len) {
          if (callback(ctx[i], i, ctx) === false) return false
        }
        return true
      }
    }

    return tactics[type]()

  }

  /**
   * 判断是否为空对象或空数组
   */
  isEmpty(): boolean {
    return this.size() === 0
  }

  size(): number {
    const ctx = this.data
    const map: Tactics<number> = {
      Array() {
        return ctx.length
      },
      Object() {
        let num = 0
        for (const key in ctx) {
          num++
        }
        return num
      }
    }
    return map[this.type]()
  }

  /**
   * 获得一个字符串的映射值
   * @param fn 映射的处理回调
   * @returns {string} 返回一个字符串
   */
  map<S extends string>(fn: (value: S, key: number, ctx: S) => S): S
  /**
   * 获得一个数组的映射值
   * @param fn 映射的处理回调
   * @returns {array} 返回一个映射后的数组
   */
  map(fn: (value: any, index: number, ctx: Arr) => any): Arr
  /**
   * 获得一个对象的映射
   * @param fn 映射的处理回调
   * @returns {object} 返回一个对象
   */
  map(fn: (value: any, key: string, ctx: Obj) => any): Obj
  map(fn: (...args: Arr) => any): any {
    const ctx = this.data
    const type = this.type
    if (ctx instanceof Array) {
      return ctx.map(fn)
    }
    if (type === "String") {
      return ctx
        .split("")
        .map(fn)
        .join("")
    }
    if (type === 'Object') {
      const ret: Obj = {}
      each(ctx, (val, key) => {
        ret[key] = fn(val, key, ctx)
      })
      return ret
    }
    return false
  }

  deepCopy(): Obj | Arr {
    const ctx = this.data
    const type = getType(ctx)

    function recursiveArr(arr: Arr): Arr {
      const ret: Arr = []
      each(arr, (val) => {
        const type = getType(val)
        if (type === 'Array') {
          ret.push(recursiveArr(val))
        } else if (type === 'Object') {
          ret.push(recursiveObj(val))
        } else {
          ret.push(val)
        }
      })
      return ret
    }

    function recursiveObj(obj: Obj): Obj {
      const ret: Obj = {}
      each(obj, (val, key) => {
        const type = getType(val)
        if (type === 'Array') {
          ret[key] = recursiveArr(val)
        } else if (type === 'Object') {
          ret[key] = recursiveObj(val)
        } else {
          ret[key] = val
        }
      })
      return ret
    }

    return type === 'Array' ? recursiveArr(ctx) : recursiveObj(ctx)
  }

  copy(): any {
    const ctx = this.data

    if (this.type === 'Array') {
      return (ctx as Arr).slice()
    } else if (this.type === 'Object') {
      const ret: Obj = {}
      each(ctx, (v, k) => ret[k] = v)
      return ret
    }
    return ctx
  }

  merge(mergeOrigin: Obj[] | Obj, keys?: string[], type: string = 'without'): void {
    type Fn = (ctx: Obj, obj: Obj) => void
    const ctx: Obj = this.data
    const mergeOriginType: string = getType(mergeOrigin)


    const mergeFn: Fn = (ctx, obj) => {
      each(ctx, (_, key) => {
        obj[key] !== undefined && (ctx[key] = obj[key])
      })
    }
    const mergeFnWithKeys: Fn = (ctx, obj) => {
      const tactics: Tactics<void> = {
        within() {
          if (keys === undefined) return
          each(keys, (key) => {
            obj[key] !== undefined && (ctx[key] = obj[key])
          })
        },

        without() {
          if (keys === undefined) return
          const withoutKeys: Obj = keys.reduce((pre: Obj, cur: string) => {
            pre[cur] = true
            return pre
          }, {})

          each(ctx, (_, key) => {
            !withoutKeys[key] && obj[key] !== undefined && (ctx[key] = obj[key])
          })
        }
      }
      tactics[type]()
    }
    if (mergeOriginType === 'Object') {
      if (keys && keys.length) {
        mergeFnWithKeys(ctx, mergeOrigin)
      } else {
        mergeFn(ctx, mergeOrigin)
      }
      return
    }
    if (mergeOriginType === 'Array') {
      if (keys && keys.length) {
        each(mergeOrigin, mergeItem => {
          mergeFnWithKeys(ctx, mergeItem)
        })
      } else {
        each(mergeOrigin, mergeItem => {
          mergeFn(ctx, mergeItem)
        })
      }
    }
  }

  /**
   * 序列化一个js对象
   * @param separator 序列化的连接符 默认值 '&
   * @returns {string} 返回一个字符串
   */
  serialize(separator: string = "&"): string {
    let ret = ""
    const ctx: Obj = this.data
    each(ctx, (val, key) => {
      const value = val && typeof val === "object" ? JSON.stringify(val) : val
      const g = `${encodeURIComponent(key)}=${encodeURIComponent(value) + separator}`
      ret += g
    })
    return ret.slice(0, -1)
  }

  /**
  * 重置对象的值为0值
  * @param keys 字段集合
  * @param type 如果未without则排除keys里面的字段如果未within则只重置keys里面的相关字段的值
  */
  resetData(keys?: string[], type: string = 'without'): void {
    const ctx = this.data
    const table: Obj = {
      Array: [],
      Object: {},
      Number: 0,
      String: ""
    }
    const arrType = getType(keys)
    if (keys === undefined || arrType !== 'Array') {
      each(ctx, (val, key) => {
        ctx[key] = table[getType(val)]
      })
      return
    }

    let exist: Obj = {}
    keys.forEach(key => exist[key] = true)


    if (type === 'within') {
      return keys.forEach(key => {
        exist[key] && (ctx[key] = table[getType(ctx[key])])
      })
    }

    each(ctx, (val, key) => {
      !exist[key] && (ctx[key] = table[getType(val)])
    })
  }

  /**
  * 获取一个对象的所有的键
  */
  keys(): Arr {
    const ctx = this.data
    if (!Object.keys) {
      const type = getType(ctx)
      const arr: Arr = []
      type === 'Object' ? each(ctx, v => arr.push(v)) : each(ctx, (_, i) => arr.push(i + ''))
      return arr
    }
    return Object.keys(ctx)
  }

  /**
   * 获取一个对象的所有值
   */
  values(): Arr {
    const ctx = this.data
    if (!Object.values) {
      const arr: Arr = []
      each(ctx, v => arr.push(v))
      return arr
    }
    return Object.values(ctx)
  }

  /**
     * 尝试解析一个字符串
     * @param str 要解析的字符串
     * @param reviver 解析过程中的额外处理钩子
     */
  parse(str: string, reviver?: (this: any, key: string, value: any) => any): string {
    try {
      return JSON.parse(str, reviver)
    } catch (error) {
      return str
    }
  }

  json(didParse: boolean = false, separator: string = '&'): Obj {
    const ret: Obj = {}
    const ctx = this.data
    const str: string = ctx[0] === '?' ? ctx.slice(1) : ctx
    if (str) {
      const couple: string[] = str.split(separator)
      each(couple, (v: string) => {
        const arr = v.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        const decodeVal = decodeURIComponent(val)

        ret[key] = didParse ? this.parse(decodeVal) : decodeVal
      })
    }
    return ret
  }

  repeat(num: number, joiner = ''): string {
    const ctx = this.data
    if (num === undefined) {
      return ctx
    }
    let i = 0, ret = ''
    while (i < num) {
      ret += ctx + joiner
      i++
    }
    return ret.replace(new RegExp(joiner + '$'), '')
  }

  /**
   * 添加数组
   * @param args 要添加的数组
   */
  add(...args: any[]): Arr {
    let len = args.length
    if (len < 1) return this.data

    let ret: any[] = [], i = -1

    while (++i < len) {
      getType(args[i]) !== "Array" ? ret.push(args[i]) : ret = ret.concat(args[i])
    }
    return this.data.concat(ret)
  }

  /**
   * 查找元素的索引
   * @param query 查询参数
   * @param useBinarySearch 是否启用二分查找(前提是有序的数组)
   */
  findIndex(query: ExcludeObj, useBinarySearch?: boolean): number
  /**
   * 查找复杂元素的索引
   * @param query 查询参数
   */
  findIndex(query: Obj): number
  findIndex(query: any, useBinarySearch?: boolean): any {
    if (useBinarySearch) {
      return this.binarySearch(query)
    }
    const ctx = this.data
    const len = ctx.length

    // query不为对象时
    if (typeof query !== 'object') {
      let i = 0

      while (i < len) {
        if (query === ctx[i]) return i
        i++
      }
      return -1
    }
    let i = -1
    while (++i < len) {
      let isMatched = true
      for (const key in query) {
        if (ctx[i][key] !== query[key]) isMatched = false; break
      }
      if (isMatched) return i
    }
    return -1
  }

  has(query: ExcludeObj): boolean
  has(query: Obj): boolean
  has(query: any): any {
    return this.findIndex(query) !== -1
  }

  /**
   * 数组去重
   * @param key 复杂对象的字段,传入此参数则根据此参数的值进行去重
   */
  set<T>(key?: string): T[] {
    if (this.type !== 'Array') throw new Error('data is not instance of Array')

    const ctx = this.data

    if (Array.from && key === undefined) {
      return Array.from(new Set(ctx))
    }

    const obj: Obj = {}
    const arr: T[] = []
    if (key === undefined) {
      each(ctx, (v) => {
        const key = typeof v + v
        if (!obj[key]) {
          obj[key] = true
          arr.push(v)
        }
      })
      return arr
    }
    each(ctx, (v) => {
      const _key = v[key]
      if (!obj[_key]) {
        obj[_key] = true
        arr.push(v)
      }
    })
    return arr
  }

  /**
   * 二分查找
   * @param value 要查找的值
   * @param key 复杂数据的字段
   */
  binarySearch(value: number | string, key?: string): number {
    const ctx: any[] = this.data
    let start = 0
    let end = ctx.length - 1
    function getMid(): number {
      return Math.floor((start + end) / 2)
    }
    let midIndex = getMid()

    if (key === undefined) {
      while (start <= end) {
        if (value > ctx[midIndex]) {
          start = midIndex + 1
          midIndex = getMid()
        } else if (value < ctx[midIndex]) {
          end = midIndex - 1
          midIndex = getMid()
        } else {
          return midIndex
        }
      }
      return -1
    }
    while (start <= end) {
      if (value > ctx[midIndex][key]) {
        start = midIndex + 1
        midIndex = getMid()
      } else if (value < ctx[midIndex][key]) {
        end = midIndex - 1
        midIndex = getMid()
      } else {
        return midIndex
      }
    }
    return -1
  }
}

export default function wt(data: any): DWrap {
  return new DWrap(data)
}