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
    template: path.resolve(usePath, usePro, 'index.js'),
    filename: 'index.html'
  }
  return obj
}

const tip = () => {
  console.log(chalk.yellow(`\n启动项目：${usePro}`))
}

const proxyTraget = ((usePro) => {
  switch (usePro) {
    case 'bigvay':
      return 'https://b.bigvay.vn'
    case 'PVdong':
      return 'https://p.pvdong.vn'
    case 'topdong':
      return 'https://t.topdong.vn'
    case 'richdong':
      return 'https://r.richdong.vn'
    // case 'richdong':
    //   return 'https://t.tapkredit.vn'
    case 'topvay':
      return 'https://t.tapkredit.vn'
    default:
      return 'https://uat.51bmsh.com'
  }
})(usePro)

module.exports = {
  entry,
  tip,
  proxyTraget
}
