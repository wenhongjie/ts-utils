export type Obj = Record<string, any>

export type Arr = any[]

export type ExcludeObj = string | number | boolean | null | undefined

export interface Tactics<T> {
  [key: string]: () => T
}