import { wt } from '../src/data'

const arr = [1, 2, 3, 4, 5]
const obj = { name: 'Hodge', age: 23, height: 175 }
const num = 10
const str = 'abcdef'
test('each map 遍历映射', () => {
  const ret = wt(arr).map((value: number, index) => {
    return value * index
  })
  const retObj = wt(obj).map((value, key: string) => (key === 'height' ? value + 'cm' : value))
  expect(ret).toEqual([0, 2, 6, 12, 20])
  expect(retObj).toEqual({ name: 'Hodge', age: 23, height: '175cm'})

  let times = 0
  wt(num).each((v, i, nu) => {
    times++
  })
  expect(times).toBe(10)

  const mapStr = wt(str).map(v => v + ' ')

  expect(mapStr).toBe('a b c d e f ')

})

test('findIndex查找', () => {
  expect(
    // wt(arr).findIndex(3) === 2 && wt(arr).findIndex(8) === -1 && 
    wt(arr).findIndex(4, true) === 3
  ).toBeTruthy()
})


test('set去重', () => {
  const arr = [1, 1, 2, 2, 2, 3, 3]
  const arr1 = [{id: 1}, {id: 2}, {id: 1}, {id: 3}]
  expect(wt(arr).set()).toEqual([1, 2, 3])
  expect(wt(arr1).set('id')).toEqual([{id: 1}, {id: 2}, {id: 3}])
})

test('isEmpty 数组或对象是否为空', () => {
  expect(wt({}).isEmpty()).toBeTruthy()
  expect(wt([]).isEmpty()).toBeTruthy()
  expect(wt([1]).isEmpty()).toBeFalsy()
  expect(wt({a: 1}).isEmpty()).toBeFalsy()
})

test('keys 将对象的key转化数组集合', () => {
  expect(
    wt(obj).keys()
  ).toEqual(
    ['name', 'age', 'height']
  )
})

test('keys 将对象的value转化数组集合', () => {
  expect(
    wt(obj).values()
  ).toEqual(
    ['Hodge', 23, 175]
  )
})

test('serialize 序列化', () => {
  const ret = wt(obj).serialize()
  expect(ret).toBe(
    'name=Hodge&age=23&height=175'
  )
})

test('json 序列化数据转json', () => {
  const ret = wt('name=Hodge&age=23&height=175').json()
  const ret2 = wt('name=Hodge&age=23&height=175').json(true)
  expect(ret).toEqual(
    {name: 'Hodge', age: '23', height: '175'}
  )
  expect(ret2).toEqual(
    obj
  )
})

test('resetData 数据重置', () => {
  const obj = { a: 1, b: {a: 1}, c: '3', d: [2] }

  wt(obj).resetData(['a'], 'within')
  expect(obj).toEqual({ a: 0, b: {a: 1}, c: '3', d: [2] })
  wt(obj).resetData(['b'], 'within')
  expect(obj).toEqual({ a: 0, b: {}, c: '3', d: [2] })
  wt(obj).resetData(['c'], 'within')
  expect(obj).toEqual({ a: 0, b: {}, c: '', d: [2] })
  wt(obj).resetData(['d'])
  expect(obj).toEqual({ a: 0, b: {}, c: '', d: [2] })
  wt(obj).resetData(['a'])
  expect(obj).toEqual({ a: 0, b: {}, c: '', d: [] })
})

test('has 是否有某个值', () => {
  expect(
    wt(arr).has(1)
  ).toBeTruthy()

  expect(
    wt(arr).has(4)
  ).toBeTruthy()

  expect(
    wt(arr).has(10)
  ).toBeFalsy()
})

test('add 数组相加', () => {
  expect(
    wt(arr).add(1, 2)
  ).toEqual(
    arr.concat([1, 2])
  )

  expect(
    wt(arr).add([1, 2])
  ).toEqual(
    arr.concat([1, 2])
  )

  expect(
    wt(arr).add([1, 2], 3)
  ).toEqual(
    arr.concat([1, 2, 3])
  )
})

test('深度遍历', () => {
  const obj = {
    a: 1,
    b: { a: 1, b: [2] }
  }

  const retObj: { [key: string]: any } = wt(obj).deepCopy()

  expect(
    retObj
  ).toEqual(obj)

  expect(
    retObj.b === obj.b
  ).toBeFalsy()

  expect(
    retObj.b.b === obj.b.b
  ).toBeFalsy()
})

test('数据混合', () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3
  }
  wt(obj).merge([{a: 3}, {b: '张三'}, {a: '李四', c: '66'}])
  expect(
    obj
  ).toEqual({
    a: '李四',
    b: '张三',
    c: '66'
  })

  wt(obj).merge({a: 1, b: 1, c: 1}, ['a', 'b'])
  expect(
    obj
  ).toEqual({
    a: '李四',
    b: '张三',
    c: 1
  })

  wt(obj).merge({a: 1, b: 1, c: 1}, ['a'], 'within')
  expect(
    obj
  ).toEqual({
    a: 1,
    b: '张三',
    c: 1
  })
})