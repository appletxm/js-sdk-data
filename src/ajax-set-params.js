export function setDefault(options){
}

export function setParamsForGet (options) {
  let params = '?timer=' + (new Date().getTime()) + '&'
  let opP = options.params
  let keys = Object.keys(opP)

  if (options.headers.contentType.indexOf('application/json') >= 0) {
    params = params + 'params=' + encodeURIComponent(JSON.stringify(opP))
  } else {
    for (let i = 0; i < keys.length; i++) {
      params += (keys[i] + '=' + opP[key[i]] + (i === keys.length - 1 ? '' : '&'))
    }
  }

  return params
}

export function setParamsForPost (options) {
  let params = ''
  let opP = options.params
  let keys = Object.keys(opP)

  if (options.headers.contentType.indexOf('application/json') >= 0) {
    params = JSON.stringify(opP)
  } else if (options.headers.contentType.indexOf('application/x-www-form-urlencoded') >= 0) {
    for (let i = 0; i < keys.length; i++) {
      params += (keys[i] + '=' + encodeURIComponent(opP[keys[i]]) + (i === keys.length - 1 ? '' : '&'))
    }
  } else if (options.headers.contentType.indexOf('multipart/form-data') >= 0) {
    params = ''
  } else if (options.headers.contentType.indexOf('text/xml') >= 0) {
    params = ''
  }

  return params
}
