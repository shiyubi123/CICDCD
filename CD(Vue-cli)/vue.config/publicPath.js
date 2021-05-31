const packConfig = require('../config/pack.json')
const useEnv = packConfig.useEnv
const usePro = packConfig.usePro
const project = packConfig[usePro][useEnv]

const publicPath = () => {
  if (useEnv === 'dev') {
    return '/'
  } else {
    return project.baseUrl ? project.baseUrl : './'
  }
}

module.exports = {
  publicPath
}
