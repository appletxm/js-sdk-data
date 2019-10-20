export function doSet(options, xhrObj) {
  //.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  let headers = options.headers
  
  for(let key in headers){
    let newKey
    newKey = key === 'contentType' ? 'Content-Type' : key
    xhrObj.setRequestHeader(newKey, headers[key])
  }
  // if(options.method === 'POST'){
  //   xhrObj.setRequestHeader('Content-Length', options.paramsStr.length)
  // }
}
