const express = require('express')
const http2 = require('http2')
const fs = require('fs')
const path = require('path')
const port = 3000
const host = '127.0.0.1'
const app = express()
const spdy = require('spdy')
const routerAssets = require('./server-router')
const logger = require('./server-log')

const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../http2-auth/server.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../http2-auth/server.crt'))
}

app.get('/assets/images/*', (req, res) => {
  routerAssets(req, res, logger)
})

app.get('/', (req, res) => {
  // res.status(200).sendFile(fs.readFileSync(path.resolve(__dirname, '../http2.html')))
  res.set('content-type', 'text/html')
  res.send(fs.readFileSync(path.resolve(__dirname, '../http2.html')))
  res.end()
})

spdy.createServer(options, app).listen(port, (error) => {
  if (error) {
    console.error(error)
    return process.exit(1)
  } else {
    console.log(`Server is running on https://${host}:${port}`)
  }
})

// http2.createSecureServer(options, app).listen(PORT, host, (err) => {
//   if (err) {
//     console.error(err)
//     return process.exit(1)
//   }

//   console.log(`Server is running on https://${host}:${ PORT }`)
// })