/**
 * 获取任意值的类型
 * @param any 任意类型的值
 */
export const getType = (any) => {
    return Object.prototype.toString.call(any).slice(8, -1);
};
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
