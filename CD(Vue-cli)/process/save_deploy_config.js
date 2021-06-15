function saveDeployConfig(hadleRes) {
  const deployConfig = {
    serverConfig: hadleRes,
    usePro: USE_PRO,
    proType: PRO_TYPE,
    curPath: CUR_PATH
  }
  await saveJson(deployConfig, path.resolve(__dirname, './../server/config.json'))
}

module.exports = { saveDeployConfig }