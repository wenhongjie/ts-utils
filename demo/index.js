import { wt, Cache, date, Url, Asula } from '../src/index'

window.wt = wt
window.Cache = Cache
window.date = date
window.Url = Url
window.Asula = Asula

const file = document.getElementById('file')

file.onchange = function () {
  const file = this.files[0]
  console.log(wt(file).type, file, file instanceof Blob)
}