const historyPackConfigs = require('./../config/pack.json')
const historyServerConfigs = require('./../config/server.json')

const historySSHConfigs = require('./../config/server/ssh.json')
const historyPathConfigs = require('./../config/server/publicPath.json')

function handleConfig(config) {
  if (PRO_TYPE === 'Vue') handlePackConfig(config.packConfig)
  const serverConfig = handleServerConfig(config.serverConfig)
  return serverConfig
}

function handlePackConfig(packConfig) {

  let packConfigs = historyPackConfigs
  packConfigs.usePro = USE_PRO
  packConfigs.useEnv = USE_ENV
  packConfigs.usePath = CUR_PATH
  packConfigs[USE_PRO] ? true : packConfigs[USE_PRO] = {}
  packConfigs[USE_PRO][USE_ENV] = packConfig

  saveJson(packConfigs, path.resolve(__dirname, '../config/pack.json'))
}

function handleServerConfig(serverConfig) {
  if (!serverConfig) return
  if (serverConfig.custom) serverConfig = saveCustomServerConfig(serverConfig)
  else saveServerConfig(serverConfig)
  return serverConfig
}

function saveCustomServerConfig(serverConfig) {
  const { sshConfig, pathConfig } = serverConfig
  const serverConfigs = historyServerConfigs
  const sshConfigs = historySSHConfigs
  const pathConfigs = historyPathConfigs
  serverConfigs[USE_PRO] = {
    sshConfig: sshConfig.name,
    pathConfig: pathConfig.path
  }
  sshConfigs[sshConfig.name] = sshConfig
  pathConfigs[PRO_TYPE].push(pathConfig.path)

  if (PRO_TYPE !== 'pureWeb') saveJson(serverConfigs, path.resolve(__dirname, '../config/server.json'))
  saveJson(sshConfigs, path.resolve(__dirname, '../config/server/ssh.json'))
  saveJson(pathConfigs, path.resolve(__dirname, '../config/server/publicPath.json'))

  return {
    sshConfig: sshConfig.name,
    pathConfig: pathConfig.path,
    custom: true
  }
}

function saveServerConfig(serverConfig) {
  if (PRO_TYPE === 'pureWeb') return
  const serverConfigs = historyServerConfigs
  serverConfigs[USE_PRO] = serverConfig

  saveJson(serverConfigs, path.resolve(__dirname, '../config/server.json'))
}

module.exports = { handleConfig }