import { Cache, date, Url } from '../src/utils'

test('日期 date', () => {
  const ret = date(new Date).format('yyyy-MM-dd')
  expect(
    typeof ret === 'string'
  ).toBeTruthy()
})