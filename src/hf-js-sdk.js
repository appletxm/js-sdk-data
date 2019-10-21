import { doPollyfil } from './hf-js-sdk-pollyfil'
import Ajax from './ajax'

let options = {
  serviceUrl: 'http://192.168.10.125:18080/web',
  appKey: '7ab928574cf24c0fa6cf55c8cfec26c1'
}
let HFAgent = {}

function init(params) {
  options = Object.assign(options, params)
  createAjax()
}

function createAjax() {
  let params = {
    method: 'POST',
    url: options.serviceUrl,
    headers: {
      contentType: 'application/json; charset=UTF-8',
      appKey: options.appKey
    }
  }
  HFAgent.ajax = new Ajax(params)
}

function formatData(schemeKey, jsonStr) {
  let obj = JSON.parse(jsonStr)
  let dataObj = {}
  dataObj.schemeKey = schemeKey
  for(let key in obj) {
    dataObj[key] = obj[key]
  }

  return dataObj
}

function onEvent(schemeKey, jsonStr) {
  let dataList = []
  try {
    dataList.push(formatData(schemeKey, jsonStr))
    onSend(dataList)
  } catch(err) {
    console.info('hf js sdk onEvent:', err)
  }
}

function onSend(dataList) {
  let { ajax }  = HFAgent
  
  if (arguments.length > 1 && typeof dataList === 'string') {
    dataList = [formatData(arguments[0], arguments[1])]
  }

  ajax.post({
    url: options.serviceUrl,
    params: dataList
  }).then(() => {
  }).catch(err => {
    console.info('hf js sdk onSend:', err)
  })
}

HFAgent.init = init
HFAgent.onEvent = onEvent
HFAgent.onSend = onSend
if (window) {
  window.HFAgent = HFAgent
  window.HFAgent.init({
    appKey: '${appKey}',
    serviceUrl: '${serviceUrl}'
  })
}

doPollyfil()

export default HFAgent
