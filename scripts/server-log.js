const path = require('path')
const fs = require('fs')
const log4js = require('log4js')

let date = new Date()
let dirPath =  path.resolve(__dirname, '../logs')
let filePath = path.resolve(__dirname, '../logs/' + (date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate()) + '.log')
let logger

function doSet(){
  log4js.configure({
    appenders: { cheese: { type: 'file', filename: filePath } },
    categories: { default: { appenders: ['cheese'], level: 'info' } }
  })
  logger = log4js.getLogger('cheese')
}

function outputTypes(){
  // logger.trace('Entering cheese testing');
  // logger.debug('Got cheese.');
  // logger.info('Cheese is Comté.');
  // logger.warn('Cheese is quite smelly.');
  // logger.error('Cheese is too ripe!');
  // logger.fatal('Cheese was breeding ground for listeria.');
}

function checkDir(){
  if(fs.existsSync(dirPath) !== true) {
    fs.mkdirSync(dirPath)
  }

  if(fs.existsSync(filePath) !== true) {
    fs.openSync(filePath, 'w')
  }
}

function init(){
  checkDir()
  doSet()
}

init()

module.exports = logger
