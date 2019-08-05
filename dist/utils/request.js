import { getType, each, serialize } from '../common/common';
// 判断是否为简单请求
function isSimpleReq(method) {
    return method === 'GET' || method === 'HEAD';
}
// 获取传入数据类型对应的值类型
function getContentType(dataType) {
    const map = {
        FormData: 'multipart/form-data;charset=utf-8',
        Object: 'application/json;charset=utf-8',
        String: 'text/plain;charset=utf-8'
    };
    return map[dataType];
}
// 获取请求头
function getHeaders(dataType, ...headerList) {
    const ret = {
        'Content-Type': getContentType(dataType) || 'application/x-www-form-urlencoded;charset=utf-8'
    };
    headerList.forEach(item => item && each(item, (val, key) => val && (ret[key] = val)));
    return ret;
}
// 数据转化
function dataTransform(data, method, contentType) {
    // 简单请求
    if (isSimpleReq(method))
        return null;
    // 数据类型
    const type = getType(data);
    const map = {
        formData() {
            return data;
        },
        Object() {
            return;
        }
    };
    return map[type]();
}
class Req {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || '';
        this.timeout = options.timeout || 18000;
        this.headers = options.headers || {};
        this.responseType = options.responseType || 'json';
    }
    before(fn) {
        fn();
    }
    after(callback) {
    }
    request(options) {
        // 当前请求的数据类型
        const dataType = getType(options.data);
        // 请求方法
        const method = options.method.toUpperCase();
        // 公共url
        const baseUrl = options.baseUrl || this.baseUrl;
        // 请求头
        const headers = getHeaders(dataType, this.headers, options.headers);
        /**
         * 请求地址
         * 如果是一个简单请求则需将data转化为queryString字符转拼接到请求地址中
         */
        const url = `${baseUrl}${options.url}${(isSimpleReq(method) && options.data instanceof Object ? '?' + serialize(options.data) : '')}`;
        // 请求数据
        const data = dataTransform(options.data, method, headers['Content-Type']);
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // 初始化
            xhr.open(method, url);
            // 请求状态发生变化
            xhr.onreadystatechange = function () {
            };
            // 请求超时
            xhr.ontimeout = function () {
            };
            // 发送请求头
            each(headers, (val, key) => {
                xhr.setRequestHeader(key, val);
            });
            // 发送数据
            xhr.send(data);
        });
    }
    get(url, data) {
        return this.request({
            url, method: 'get', data
        });
    }
    post(url, data) {
        return this.request({
            url, method: 'post', data
        });
    }
    put(url, data) {
        return this.request({
            url, method: 'put', data
        });
    }
    patch(url, data) {
        return this.request({
            url, method: 'patch', data
        });
    }
    delete(url, data) {
        return this.request({
            url, method: 'delete', data
        });
    }
}
export default {
    create(options) {
        return new Req(options);
    }
};
