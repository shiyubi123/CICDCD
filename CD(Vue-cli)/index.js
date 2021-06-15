require('./global')
const { chooseProject } = require('./process/choose_project')
const { getProConfig } = require('./process/get_config')
const { handleConfig } = require('./process/handle_config')

start()

async function start() {
  try {
    const project = USE_PRO = await chooseProject()
    const config = await getProConfig(project)
    const hadleRes = await handleConfig(config)
    const deployConfig = {
      serverConfig: hadleRes,
      usePro: USE_PRO,
      proType: PRO_TYPE,
      curPath: CUR_PATH
    }
    await saveJson(deployConfig, path.resolve(__dirname, './server/config.json'))
  } catch (e) {
    logError(e.message)
  }
}
