import { Obj, Arr } from '../types/index'

type ObjCb = (val: any, key: string, target: Obj) => void
type ArrCb = (val: any, index: number, target: Obj) => void

/**
 * 获取任意值的类型
 * @param any 任意类型的值
 */
export const getType = (any: any): string => {
  return Object.prototype.toString.call(any).slice(8, -1)
}

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
