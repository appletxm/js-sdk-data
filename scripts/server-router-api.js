const fs = require('fs')
const path = require('path')

function getMockFiles (req, res) {
  let filePath
  let file
  let parseFile

  try {
    filePath = path.resolve(__dirname, '../mocks/' + req['baseUrl'] + ((/^\/.+$/).test(req['path']) ? req['path'] : '') + '.json')
    file = fs.readFileSync(filePath, {encoding: 'utf-8'})
    parseFile = file ? JSON.parse(file) : {}
    parseFile.code = '200'
    parseFile.msg = 'Get data success'
  } catch(e) {
    parseFile = {}
    parseFile.code = '999'
    parseFile.msg = 'Fail to get data'
  }
  parseFile = JSON.stringify(parseFile)

  res.set({
    'Content-Type': 'application/json;charset=UTF-8',
    'Content-Length': parseFile.length
  })
  res.send(parseFile)
  res.end()
}

function getAjaxGet (req, res) {
  let params

  if(req['_parsedUrl']['query'] ){
    params = decodeURIComponent((req['_parsedUrl']['query'].match(/params=(.+)/))[1])
    params = JSON.parse(params)
  }
  getMockFiles(req, res)
}

function getParamsFromForm (body) {
  let keysValues = body.match(/([^&=]+)=([^&=]*)/g)
  let params = {}

  // console.info(body, keysValues)

  keysValues && keysValues.forEach(keyValue => {
    let splitObj = keyValue.split('=')
    let key = splitObj[0]
    params[key] = decodeURIComponent(splitObj[1])
  })

  return params
}

function handleMultipartDataForm (req, res, cb) {
  let formidable = require('formidable')
  let form = new formidable.IncomingForm()

  // form.uploadDir = path.resolve(__dirname, '../tmp/')
  form.uploadDir = './tmp/'
  form.keepExtensions = false
  form.maxFieldsSize = 2 * 1024 * 1024 // 为2MB

  form.on('progress', (bytesReceived, bytesExpected) => {
    console.info('##progress###', bytesReceived, bytesExpected)
  })

  form.on('field', (name, value) => {
    console.info('##field###', name, value)
  })

  form.on('fileBegin', (name, file) => {
    console.info('##fileBegin###', name, file)
  })

  form.on('file', (name, file) => {
    console.info('##file###', name, file)
  })

  form.on('end', () => {
    console.info('##end###')
  })

  form.parse(req, (err, fields, files) => {
    if (err) {
      // Check for and handle any errors here.
      console.error(err.message)
      return
    } else {
      console.info({fields: fields, files: files})
    }
  })
}

function handlePureFileUpload(body, req, res) {
  let filePath = path.resolve(__dirname, '../uploads/' + decodeURIComponent(req.query.name).toLowerCase())

  // fs.openSync(filePath, 'w+')
  fs.writeFileSync(filePath, body)

  res.send({
    code: '200',
    msg: 'pure file upload success'
  })
}

function getAjaxPost (req, res) {
  let body = ''
  let params
  let isWWWreq = (req['headers']['content-type']).indexOf('application/x-www-form-urlencoded') >= 0
  let isJsonReq = (req['headers']['content-type']).indexOf('application/json') >= 0
  let isMultipartFormReq = (req['headers']['content-type']).indexOf('multipart/form-data') >= 0
  let isFileReq = (req['headers']['content-type']).indexOf('application/octet-stream') >= 0

  req.on('data', (chunk) => {
    body += chunk
  })

  req.on('end', () => {
    console.info(`[HTTP ${req.method.toUpperCase()} params]`, body)

    if (isWWWreq === true) {
      params = getParamsFromForm(body)
      getMockFiles(req, res)
    } else if (isMultipartFormReq === true) {
      handleMultipartDataForm(req, res)
    } else if(isJsonReq === true) {
      params = JSON.parse(body)
      getMockFiles(req, res)
    } else if (isFileReq === true) {
      handlePureFileUpload(body, req, res)
    } else {
      params = JSON.parse(decodeURIComponent(body))
      getMockFiles(req, res)
    }
  })
}

function routerApi (req, res, logger) {
  console.info(`[HTTP ${req.method.toUpperCase()} api]`, req.baseUrl, req.originalUrl)
  logger.info(`[HTTP ${req.method.toUpperCase()} api]`, req.baseUrl, req.originalUrl)

  // console.info(req.headers, req.method)

  if (req.method === 'GET') {
    getAjaxGet(req, res)
  } else if (req.method === 'POST') {
    getAjaxPost(req, res)
  }

// if (next && typeof next === 'function') {
//   next()
// }
}

module.exports = routerApi
