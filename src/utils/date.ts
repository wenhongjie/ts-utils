import { Obj } from '../types/index'
type DateParam = string | number | Date

class Time {
  date: Date

  constructor(date: DateParam = new Date()) {
    this.date = (date instanceof Date) ? date : new Date(date)
  }

  format (fmt = 'yyyy-MM-dd hh:mm:ss'): string {
    const ctx = this.date
    var map: Obj = {
      'M+': ctx.getMonth() + 1, //月份
      'd+': ctx.getDate(), //日
      'h+': ctx.getHours() % 12 == 0 ? 12 : ctx.getHours() % 12, //小时
      'H+': ctx.getHours(), //小时
      'm+': ctx.getMinutes(), //分
      's+': ctx.getSeconds(), //秒
      'q+': Math.floor((ctx.getMonth() + 3) / 3), //季度
      S: ctx.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (ctx.getFullYear() + '').substr(4 - RegExp.$1.length))


    for (var k in map)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? map[k] : ('00' + map[k]).substr(('' + map[k]).length)
        )
    return fmt
  }

  getMonthDays (month: number, year: number) {
    const currentDate = this.date
    // 默认当前年月
    month = month || currentDate.getMonth() + 1
    year = year || currentDate.getFullYear()
    const date = new Date(year, month, 0)
    return date.getDate()
  }

}

export default function date(date: string | number | Date): Time {
  return new Time(date)
}