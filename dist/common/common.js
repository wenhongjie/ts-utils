/**
 * 获取任意值的类型
 * @param any 任意类型的值
 */
const toString = Object.prototype.toString;
export const getType = (value) => toString.call(value).slice(8, -1);
export function each(target, cb) {
    const type = getType(target);
    if (type === 'Object') {
        for (const key in target) {
            cb(target[key], key, target);
        }
    }
    else if (type === 'Array') {
        let i = 0, len = target.length;
        while (i < len) {
            cb(target[i], i, target);
            i++;
        }
    }
}
export function serialize(data) {
    let ret = "";
    each(data, (val, key) => {
        const value = val && typeof val === "object" ? JSON.stringify(val) : val;
        const group = `${key}=${value}&`;
        ret += group;
    });
    return encodeURI(ret.slice(0, -1));
}
export function json(queryString) {
    return JSON.parse('{"' + decodeURI(queryString.replace(/&/g, `","`).replace(/=/g, `":"`).replace(/^\?+/, '')) + '"}');
}
