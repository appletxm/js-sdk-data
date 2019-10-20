function execCb(cb, parmas) {
  let result

  if (cb && typeof cb === 'function') {
    result = cb(parmas)
    if (result instanceof MyPromise) {
      return result
    } else {
      return new MyPromise(result)
    }
  } 
}
class MyPromise {
  constructor(asynFn) {
    this.pending = true
    this.fullfilled = false
    this.rejected = false
    this.thenCb = null
    this.catchCb = null
    this.finalyCb = null
    
    asynFn && asynFn(this.resolve.bind(this), this.reject.bind(this))
  }

  resolve(data) {
    this.fullfilled = true
    execCb(this.thenCb, data)
    execCb(this.finalyCb)
  }
  
  reject(error) {
    this.rejected = true
    execCb(this.catchCb, error)
    execCb(this.finalyCb)
  }

  then(thenFn) {
    this.thenCb = thenFn
  }

  catch(catchFn) {
    this.catchCb = catchFn
  }

  finaly(finalyFn) {
    this.finalyCb = finalyFn
  }
}

export { MyPromise }
