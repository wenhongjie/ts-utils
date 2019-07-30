import { getType } from '../common/common'

interface Configs {
  baseUrl?: string;
  url: string;
  method: string;
  headers?: { [key: string]: string };
  data?: any;
  timeout?: number;
  responseType?: string;
}

new XMLHttpRequest().send()

type Data = string | Document | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null

class Req {
  constructor() {
    
  }

  baseUrl = '';

  timeout = 18000;

  before (fn: Function) {

  }

  after (callback: Function) {

  }

  request(configs: Configs) {

  }

  get (url: string, data?: Data) {
    return this.request({
      url, method: 'get', data
    })
  }

  post () {

  }

  put () {

  }

  patch () {

  }

  delete () {

  }

}








const xhr = new XMLHttpRequest()
xhr.open('get', 'xxxx')

xhr.onreadystatechange = function (e) {

}

xhr.setRequestHeader('xxx', 'xxx')

xhr.send()

export default {
  create () {

  }
}