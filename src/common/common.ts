import { Obj, Arr } from '../types/index'

type ObjCb = (val: any, key: string, target: Obj) => void
type ArrCb = (val: any, index: number, target: Obj) => void

/**
 * 获取任意值的类型
 * @param any 任意类型的值
 */
const toString = Object.prototype.toString


export const getType = (value: any): string => toString.call(value).slice(8, -1)

/**
 * 遍历数组并执行传入的回调函数
 * @param arr 目标数组
 * @param cb 回调函数
 */
export function each(arr: Arr, cb: ArrCb): void
/**
 * 遍历对象并执行传入的回调函数
 * @param obj 目标对象
 * @param cb 回调函数
 */
export function each(obj: Obj, cb: ObjCb): void

export function each(target: any, cb: any): void {
  const type = getType(target)
  if (type === 'Object') {
    for (const key in target) {
      cb(target[key], key, target)
    }
  } else if (type === 'Array') {
    let i = 0, len = target.length
    while (i < len) {
      cb(target[i], i, target)
      i++
    }
  }
}

export function serialize (data: Obj) {
  let ret = ""
  each(data, (val, key) => {
    const value = val && typeof val === "object" ? JSON.stringify(val) : val
    const group = `${key}=${value}&`
    ret += group
  })
  return encodeURI(ret.slice(0, -1))
}

export function json (queryString: string) {
  return JSON.parse('{"' + decodeURI(queryString.replace(/&/g, `","`).replace(/=/g, `":"`).replace(/^\?+/, '')) + '"}')
}
