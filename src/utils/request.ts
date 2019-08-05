import { getType, each, serialize } from '../common/common'

type Data = string | Document | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null | undefined

interface Options {
  baseUrl?: string;
  headers?: Record<string, string>;
  timeout?: number;
  responseType?: string;
}

interface RequestOptions extends Options {
  url: string;
  method: string;
  data?: Data;
}

// 判断是否为简单请求
function isSimpleReq (method: string) {
  return method === 'GET' || method === 'HEAD'
}

// 获取传入数据类型对应的值类型
function getContentType (dataType: string): string {
  const map: Record<string, string> = {
    FormData: 'multipart/form-data;charset=utf-8',
    Object: 'application/json;charset=utf-8',
    String: 'text/plain;charset=utf-8'
  }
  return map[dataType]
}

// 获取请求头
function getHeaders (dataType: string, ...headerList: (Record<string, string> | undefined) []) {
  const ret: Record<string, string> = {
    'Content-Type': getContentType(dataType) || 'application/x-www-form-urlencoded;charset=utf-8'
  }
  headerList.forEach(item => item && each(item, (val, key) => val && (ret[key] = val)))
  return ret
}

// 数据转化
function dataTransform (data: Data, method: string, contentType: string ): any {
  // 简单请求
  if (isSimpleReq(method)) return null

  // 数据类型
  const type = getType(data)

  const map: Record<string, () => any> = {
    formData () {
      return data
    },

    Object () {
      return
    }
  }

  return map[type]()
}

class Req {
  constructor(options: Options = {}) {
    this.baseUrl = options.baseUrl || ''
    this.timeout = options.timeout || 18000
    this.headers = options.headers || {}
    this.responseType = options.responseType || 'json'
  }

  responseType: string;

  baseUrl: string;

  timeout: number;

  headers: Record<string, string>;

  before (fn: Function) {
    fn ()
  }

  after (callback: Function) {

  }

  request(options: RequestOptions) {
    // 当前请求的数据类型
    const dataType = getType(options.data)

    // 请求方法
    const method = options.method.toUpperCase()

    // 公共url
    const baseUrl = options.baseUrl || this.baseUrl

    // 请求头
    const headers = getHeaders(dataType, this.headers, options.headers)

    /**
     * 请求地址
     * 如果是一个简单请求则需将data转化为queryString字符转拼接到请求地址中
     */
    const url = `${baseUrl}${options.url}${(isSimpleReq(method) && options.data instanceof Object ? '?' + serialize(options.data) : '')}`

    // 请求数据
    const data = dataTransform(options.data, method, headers['Content-Type'])

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // 初始化

      xhr.open(method, url)

      // 请求状态发生变化
      xhr.onreadystatechange = function () {

      }

      // 请求超时
      xhr.ontimeout = function () {

      }

      // 发送请求头
      each(headers, (val, key) => {
        xhr.setRequestHeader(key, val)
      })

      // 发送数据
      xhr.send(data)

    })
  }

  get (url: string, data?: Data) {
    return this.request({
      url, method: 'get', data
    })
  }

  post (url: string, data?: Data) {
    return this.request({
      url, method: 'post', data
    })
  }

  put (url: string, data?: Data) {
    return this.request({
      url, method: 'put', data
    })
  }

  patch (url: string, data?: Data) {
    return this.request({
      url, method: 'patch', data
    })
  }

  delete (url: string, data?: Data) {
    return this.request({
      url, method: 'delete', data
    })
  }

}

export default {
  create (options: Options) {
    return new Req(options)
  }
}