import { Obj } from '../types/index'
import { each, getType } from '../common/common'

function parse (str: string) {
  let ret: any = null
  try {
    ret = JSON.parse(str)
  } catch {
    ret = str
  }
  return ret
}

class WStore {
  storage: Obj
  constructor(type: string = 'sessionStorage') {
    this.storage = (window as Obj)[type]
  }

  get(key?: string, didParse: boolean = true) {
    if (key === undefined) {
      const ret: Obj = {}
      didParse ? each(this.storage, (val, key) => ret[key] = parse(val)) : each(this.storage, (val, key) => ret[key] = val)
      return ret
    }
    const value = this.storage.getItem(key)
    return didParse ? parse(value) : value
  }

  set (key: string, value: any): WStore
  set (obj: Obj): WStore
  set(keyOrObj: any, value?: any): WStore {
    const type: string = getType(keyOrObj)

    if (type === 'Object') {
      each(keyOrObj, (val, key) => {
        const valType = getType(val)
        const ret = valType !== "Object" && valType !== "Array" ? val : JSON.stringify(val)
        this.storage.setItem(key, ret)
      })
      return this
    }

    const valueType: string = getType(value)

    this.storage.setItem(keyOrObj, valueType !== "Object" && valueType !== "Array" ? value : JSON.stringify(value))
    return this
  }

  remove(item: string) {
    this.storage.removeItem(item)
  }

  clear() {
    this.storage.clear()
  }
}

class Cookie {
  initialized: boolean
  cookie: Obj
  constructor () {
    this.initialized = false
    this.cookie = Object.create(null)
  }

  private _update (key: string, value: any, date: Date, days: number) {
    date.setTime(+date + 86400000 * days)
    const expires = date.toUTCString()
    const type = getType(value)
    const isObjOrArr = type === 'Object' || type === 'Array'
    value = isObjOrArr ? encodeURIComponent(JSON.stringify(value)) : value
    days > 0 && (this.cookie[key] = value)
    document.cookie = `${key}=${value}; expires=${expires}`
  }

  private init () {
    document.cookie.split(';').map(v => decodeURIComponent(v).trim().split('=')).forEach(v => this.cookie[v[0]] = !Number.isNaN(+v[1]) ? +v[1] : v[1])
    this.initialized = true
  }

  public get (key?: string) {
    !this.initialized && this.init()   // 先执行初始化操作
    return key ? this.cookie[key] : this.cookie
  }

  public set (...args: any[]) {
    !this.initialized && this.init()   // 先执行初始化操作
    const [first, second, third] = args
    const isObject = getType(first) === 'Object'
    const date = new Date()
    const days = isObject ? (second || 30) : (third || 30)
    isObject ? each(first, (val, key: string) => this._update(key, val, date, days)) : this._update(first, second, date, days)
  }

  public remove (...args: string []) {
    !this.initialized && this.init()   // 先执行初始化操作
    const date = new Date()
    each(args, arg => {
      if (!this.cookie[arg]) return
      this._update(arg, '', date, -1)
      delete this.cookie[arg]
    })
  }

}

interface Cache {
  tactics: Obj;
  [key: string]: any;
  create (type: string): WStore | Cookie
}

const cache: Cache =  {

  tactics: {
    sessionStorage: () => new WStore('sessionStorage'),
    localStorage: () => new WStore('localStorage'),
    cookie: () => new Cookie()
  },

  create (this: Cache, type: string): WStore | Cookie {
    if (!this[type]) {
      const fn = this.tactics[type]
      this[type] = fn ? fn() : null
    }
    return this[type]
  }
}
export default cache