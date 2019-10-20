export function doDownLoad(xhr) {
  let blob = new Blob([xhr.response], {type: "application/vnd.ms-excel"})
  let contentDisposition = xhr.getResponseHeader('content-disposition')
  let matchedObj = contentDisposition.match(/filename=([^;]+)/)
  let fileName = matchedObj && matchedObj[1] ? decodeURIComponent(matchedObj[1]) : 'download.excel'

  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, fileName)
    return false
  }

  let url = URL.createObjectURL(blob)
  let a = document.createElement('a')
  let body = document.querySelector('body')
  if (url.indexOf(window.location.host) < 0) {
    url = url.replace(/^(blob:)(.+)$/, function(str, $1, $2) {
      return $1 + (window.location.protocol + '//' + window.location.host + '/') + $2
    }) 
  }
  a.href = url
  a.download = fileName
  body.appendChild(a)
  a.click()
  body.removeChild(a)
}
