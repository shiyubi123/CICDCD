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
  if (serverConfig.sshCustom || serverConfig.pathCustom) serverConfig = saveCustomServerConfig(serverConfig)
  else saveServerConfig(serverConfig)
  return serverConfig
}

function saveCustomServerConfig(serverConfig) {
  const { sshConfig, pathConfig, sshCustom, pathCustom } = serverConfig
  const serverConfigs = historyServerConfigs
  const sshConfigs = historySSHConfigs
  const pathConfigs = historyPathConfigs

  const res = {
    sshConfig: sshConfig,
    pathConfig: pathConfig,
    custom: true
  }

  if (PRO_TYPE !== 'pureWeb') {
    serverConfigs[USE_PRO] = {
      sshConfig: sshConfig.name,
      pathConfig: pathConfig.path
    }
    saveJson(serverConfigs, path.resolve(__dirname, '../config/server.json'))
  }

  if (sshCustom) {
    res.sshConfig = [sshConfig.name]
    sshConfigs[sshConfig.name] = sshConfig
    saveJson(sshConfigs, path.resolve(__dirname, '../config/server/ssh.json'))
  }

  if (pathCustom) {
    res.pathConfig = pathConfig.path
    pathConfigs[PRO_TYPE].push(pathConfig.path)
    saveJson(pathConfigs, path.resolve(__dirname, '../config/server/publicPath.json'))
  }

  return res
}

function saveServerConfig(serverConfig) {
  if (PRO_TYPE === 'pureWeb') return
  const serverConfigs = historyServerConfigs
  serverConfigs[USE_PRO] = serverConfig

  saveJson(serverConfigs, path.resolve(__dirname, '../config/server.json'))
}

module.exports = { handleConfig }