const express = require('express')
// const path = require('path')
// const open = require('open')
const app = express()
const assetsRouter = require('./server-router-assets')
const apiRouter = require('./server-router-api')
const logger = require('./server-log')

const port = 9000
const host = '127.0.0.1'

app.use(['/api', '/app/v1', '/web'], (req, res) => {
  apiRouter(req, res, logger)
})

app.use(['/', '/src', '/assets'], (req, res) => {
  assetsRouter(req, res, logger)
})

app.use('*', (req, res) => {
  logger.info('No Url Matched', req.originalUrl)
  res.send('no matched url')
})

app.listen(port, host, function () {
  let url = 'http://' + host + ':' + port
  console.info('dev server started at: ', url)
  logger.info('dev server started at: ', url)

// setTimeout(function () {
//   let openUrl = url
//   open(openUrl, 'chrome')
// }, 3000)
})
