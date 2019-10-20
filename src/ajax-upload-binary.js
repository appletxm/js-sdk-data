function compatiableSendBinary () {
  if (!XMLHttpRequest.prototype.sendAsBinary) {
    XMLHttpRequest.prototype.sendAsBinary = function (datastr) {
      function byteValue (x) {
        return x.charCodeAt(0) & 0xff
      }
      var ords = Array.prototype.map.call(datastr, byteValue)
      var ui8a = new Uint8Array(ords)
      this.send(ui8a.buffer)
    }
  }
}

function sendAjax (binaryFile, url) {
  // 构造 XMLHttpRequest 对象，发送文件 Binary 数据
  var xhr = new XMLHttpRequest()
  xhr.open('POST', url/*, async, default to true */)
  xhr.setRequestHeader('Content-Type', 'application/octet-stream')
  xhr.overrideMimeType('application/octet-stream')
  xhr.sendAsBinary(binaryFile)

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        console.log('upload complete')
        console.log('response: ' + xhr.responseText)
      }
    }
  }
}

export function uploadFile (binaryFile, url) {
  compatiableSendBinary()
  sendAjax(binaryFile, url)
}
