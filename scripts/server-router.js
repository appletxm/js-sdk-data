const fs = require('fs')
const path = require('path')

function getImageFile (req, res) {
  let url = req.baseUrl || req.originalUrl
  let filename = path.join(__dirname, ('..' + url))
  let fileType = (url).match(/.+\.(.+)/)
  let file = fs.readFileSync(filename)

  res.set('content-type', 'image/' + fileType[1])
  res.send(file)
  res.end()
}

function getHtmlFile (req, res) {
  let htmlFilePath = path.join(__dirname, '../index.html')
  let html = fs.readFileSync(htmlFilePath)

  res.set('content-type', 'text/html')
  res.send(html)
  res.end()
}

function getScriptFile (req, res) {
  let scriptFilePath = path.join(__dirname, '..' + req.originalUrl)
  let script = fs.readFileSync(scriptFilePath)

  res.set('content-type', 'application/x-javascript')
  res.send(script)
  res.end()
}

function getCssFile (req, res) {
  console.info('====get css file')
}

function assignRouter (req, res, next) {
  console.info('[http get]', req.baseUrl, req.originalUrl)
  if (req.originalUrl.indexOf('assets/images') >= 0) {
    getImageFile(req, res)
  } else if (req.originalUrl.indexOf('.js') >= 0) {
    getScriptFile(req, res)
  } else if (req.originalUrl.indexOf('.css') >= 0) {
    getCssFile(req, res)
  } else if (req.originalUrl.indexOf('.html') >= 0 || req.originalUrl.indexOf('.htm') >= 0) {
    getHtmlFile(req, res)
  } else {
    getHtmlFile(req, res)
  }

  if (next && typeof next === 'function') {
    next()
  }
}

module.exports = assignRouter
