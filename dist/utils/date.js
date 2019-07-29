class Time {
    constructor(date = new Date()) {
        this.date = (date instanceof Date) ? date : new Date(date);
    }
    format(fmt = 'yyyy-MM-dd hh:mm:ss') {
        const ctx = this.date;
        var map = {
            'M+': ctx.getMonth() + 1,
            'd+': ctx.getDate(),
            'h+': ctx.getHours() % 12 == 0 ? 12 : ctx.getHours() % 12,
            'H+': ctx.getHours(),
            'm+': ctx.getMinutes(),
            's+': ctx.getSeconds(),
            'q+': Math.floor((ctx.getMonth() + 3) / 3),
            S: ctx.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (ctx.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in map)
            if (new RegExp('(' + k + ')').test(fmt))
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? map[k] : ('00' + map[k]).substr(('' + map[k]).length));
        return fmt;
    }
    getMonthDays(month, year) {
        const currentDate = this.date;
        // 默认当前年月
        month = month || currentDate.getMonth() + 1;
        year = year || currentDate.getFullYear();
        const date = new Date(year, month, 0);
        return date.getDate();
    }
}
export default function date(date) {
    return new Time(date);
}
