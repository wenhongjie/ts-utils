import { each, getType } from '../common/common';
function parse(str) {
    let ret = null;
    try {
        ret = JSON.parse(str);
    }
    catch (_a) {
        ret = str;
    }
    return ret;
}
class WStore {
    constructor(type = 'sessionStorage') {
        this.storage = window[type];
    }
    get(key, didParse = true) {
        if (key === undefined) {
            const ret = {};
            didParse ? each(this.storage, (val, key) => ret[key] = parse(val)) : each(this.storage, (val, key) => ret[key] = val);
            return ret;
        }
        const value = this.storage.getItem(key);
        return didParse ? parse(value) : value;
    }
    set(keyOrObj, value) {
        const type = getType(keyOrObj);
        if (type === 'Object') {
            each(keyOrObj, (val, key) => {
                const valType = getType(val);
                const ret = valType !== "Object" && valType !== "Array" ? val : JSON.stringify(val);
                this.storage.setItem(key, ret);
            });
            return this;
        }
        const valueType = getType(value);
        this.storage.setItem(keyOrObj, valueType !== "Object" && valueType !== "Array" ? value : JSON.stringify(value));
        return this;
    }
    remove(item) {
        this.storage.removeItem(item);
    }
    clear() {
        this.storage.clear();
    }
}
class Cookie {
    constructor() {
        this.initialized = false;
        this.cookie = Object.create(null);
    }
    _update(key, value, date, days) {
        date.setTime(+date + 86400000 * days);
        const expires = date.toUTCString();
        const type = getType(value);
        const isObjOrArr = type === 'Object' || type === 'Array';
        value = isObjOrArr ? encodeURIComponent(JSON.stringify(value)) : value;
        days > 0 && (this.cookie[key] = value);
        document.cookie = `${key}=${value}; expires=${expires}`;
    }
    init() {
        document.cookie.split(';').map(v => decodeURIComponent(v).trim().split('=')).forEach(v => this.cookie[v[0]] = !Number.isNaN(+v[1]) ? +v[1] : v[1]);
        this.initialized = true;
    }
    get(key) {
        !this.initialized && this.init(); // 先执行初始化操作
        return key ? this.cookie[key] : this.cookie;
    }
    set(...args) {
        !this.initialized && this.init(); // 先执行初始化操作
        const [first, second, third] = args;
        const isObject = getType(first) === 'Object';
        const date = new Date();
        const days = isObject ? (second || 30) : (third || 30);
        isObject ? each(first, (val, key) => this._update(key, val, date, days)) : this._update(first, second, date, days);
    }
    remove(...args) {
        !this.initialized && this.init(); // 先执行初始化操作
        const date = new Date();
        each(args, arg => {
            if (!this.cookie[arg])
                return;
            this._update(arg, '', date, -1);
            delete this.cookie[arg];
        });
    }
}
const cache = {
    tactics: {
        sessionStorage: () => new WStore('sessionStorage'),
        localStorage: () => new WStore('localStorage'),
        cookie: () => new Cookie()
    },
    create(type) {
        if (!this[type]) {
            const fn = this.tactics[type];
            this[type] = fn ? fn() : null;
        }
        return this[type];
    }
};
export default cache;
