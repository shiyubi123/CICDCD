const packConfig = require('./../config/pack.json')
const useEnv = packConfig.useEnv
const usePro = packConfig.usePro
const usePath = packConfig.usePath
const project = packConfig[usePro][useEnv]

const path = require('path')
const chalk = require('chalk')

const entry = () => {
  let obj = {}
  obj[usePro] = {
    entry: path.resolve(usePath, usePro, 'main.js'),
    template: path.resolve(usePath, usePro, 'index.html'),
    filename: 'index.html'
  }
  return obj
}

const tip = () => {
  console.log(chalk.yellow(`\n启动项目：${usePro}`))
}

const proxyTraget = ((usePro) => {
  switch (usePro) {
    default:
      return ''
  }
})(usePro)

module.exports = {
  entry,
  tip,
  proxyTraget
}
