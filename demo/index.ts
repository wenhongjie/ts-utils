import { wt, Cache, date, Url } from '../src/index'


declare global {
  interface Window {
    wt(any: any): any;
    Cache: any;
    date: any;
    Url: any;
  }
}

window.wt = wt
window.Cache = Cache
window.date = date
window.Url = Url