import { Obj } from '../types/index'
import wt from '../data/index'

export default {
  getPath(index: number) {
    return index !== undefined
      ? window.location.pathname.slice(1).split("/")[index]
      : window.location.pathname
  },

  getSearch(key: string) {
    const searchStr = window.location.search
    const ret = wt(searchStr).json()
    return key !== undefined ? ret[key] : ret
  },

  search(obj: Obj) {
    window.location.search = "?" + wt(obj).serialize()
  }
}
