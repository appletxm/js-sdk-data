import { MyPromise } from './my-promise'

function assign(target, source) {
  for(var key in source) {
    target[key] = source[key]
  }

  return target
}

function doPollyfil(){
  if (!window.Promise) {
    window.Promise = MyPromise
  }

  if (!Object.assign) {
    Object.assign = assign
  }
}

export { doPollyfil }
