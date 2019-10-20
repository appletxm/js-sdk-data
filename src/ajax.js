import * as setParams from './ajax-set-params.js'
import * as setHeaders from './ajax-set-headers.js'
import * as ajaxStream from './ajax-get-stream.js'

const defaultConfig = {
  method: 'GET',
  async: true,
  url: '',
  params: {},
  timeout: 30000,
  headers: {
    contentType: 'application/json; charset=UTF-8'
  }
}
const xhrList = {}

const Ajax = class {
  constructor (opts) {
    this.options = Object.assign(defaultConfig, opts)
  }

  mergeOptions (options) {
    const copyOpts = JSON.parse(JSON.stringify(this.options))
    options = Object.assign(copyOpts, options)
    return options
  }

  createXHR (options) {
    let xhr

    if (window.ActiveXObject) {
      xhr = new ActiveXObject('Microsoft.XMLHTTP')
    } else if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest()
    }

    if (xhr.timeout) {
      xhr.timeout = options.timeout
    }

    return xhr
  }

  addEventListener (xhrId, resolveCb, rejectCb, options) {
    let xhr = xhrList[xhrId]['xhr']
    if (!xhr) {
      return false
    }

    xhr.onreadystatechange = () => {
      let resObj
      let resText

      // console.info(xhr.readyState, xhr.status)
      if(xhr.readyState === 4 && xhr.status === 200){
        let resConType = xhr.getResponseHeader('content-type')
        if (resConType.indexOf('application/octet-stream') >= 0 || resConType.indexOf('application/x-msdownload') >= 0) {
          ajaxStream.doDownLoad(xhr)
        } else {
          resText = xhr.responseText.replace(/^[\s\t\r\n]+|[\s\t\r\n]+$/g, '')
          if (resText) {
            resObj = resText && JSON.parse(xhr.responseText)
          }
          this.destroyed(xhrId)
          resolveCb({code: '200', data: resObj})
        }
      } else if(xhr.readyState === 4 && xhr.status !== 200){
        this.destroyed(xhrId)
        rejectCb({code: '500', msg: xhr.response})
      }
    }

    if (xhr.addEventListener) {
      xhr.addEventListener('timeout', () => {
        this.destroyed(xhrId)
        rejectCb({code: '10000', msg: 'request timeout'})
      })
  
      xhr.addEventListener('error', (e) => {
        this.destroyed(xhrId)
        rejectCb({code: '500', msg: e})
      })
  
      if(options.onProgress && typeof options.onProgress === 'function'){
        xhr.addEventListener('progress', (e) => {
          options.onProgress(e)
        })
      }
    }
  }

  destroyed(xhrId) {
    if(xhrList[xhrId]) {
      delete xhrList[xhrId]
    }
  }

  prepareForAjax(options){
    let xhrObj
    let xhrId
    let resolveCb
    let rejectCb
    let promise

    options = this.mergeOptions(options)
    xhrId = Math.random() + ''
    xhrList[xhrId] = {}
    xhrObj = this.createXHR(options)
    xhrList[xhrId]['options'] = options
    xhrList[xhrId]['xhrId'] = xhrId
    xhrList[xhrId]['xhr'] = xhrObj

    promise = new Promise((resolve, reject) => {
      rejectCb = reject
      resolveCb = resolve
    })

    return {options, xhrId, xhrObj, promise, resolveCb, rejectCb}
  }

  doAjax(options, xhrObj){
    xhrObj.open(options.method, options.url, options.async)
    setHeaders.doSet(options, xhrObj)
    xhrObj.send(options.paramsStr)
  }

  get (_options) {
    let params
    

    _options.method = 'GET'
    let {options, xhrObj, promise, resolveCb, rejectCb, xhrId} = this.prepareForAjax(_options)
    
    if (options.method === 'GET' && xhrObj) {
      params = setParams.setParamsForGet(options)
    }
    options.url = options.url + params
    this.addEventListener(xhrId, resolveCb, rejectCb, options)
    this.doAjax(options, xhrObj)

    return promise
  }

  post (_options) {
    _options.method = 'POST'
    let {options, xhrObj, promise, resolveCb, rejectCb, xhrId} = this.prepareForAjax(_options)

    if (options.method === 'POST' && xhrObj) {
      options.paramsStr  = setParams.setParamsForPost(options)
    }

    this.addEventListener(xhrId, resolveCb, rejectCb, options)
    this.doAjax(options, xhrObj)

    return promise
  }

  getBinary(_options) {
    let params
    

    _options.method = 'GET'
    let {options, xhrObj, promise, resolveCb, rejectCb, xhrId} = this.prepareForAjax(_options)
    
    if (options.method === 'GET' && xhrObj) {
      params = setParams.setParamsForGet(options)
    }
    options.url = options.url + params
    // options.type = 'binary'
    xhrObj.responseType = "arraybuffer"
    this.addEventListener(xhrId, resolveCb, rejectCb, options)
    this.doAjax(options, xhrObj)

    return promise
  }
}

export default Ajax
