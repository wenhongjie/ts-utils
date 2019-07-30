
class Req {
  static create (): Req {
    return new Req
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