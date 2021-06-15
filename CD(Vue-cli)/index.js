require('./global')
const { chooseProject } = require('./process/choose_project')
const { getProConfig } = require('./process/get_config')
const { handleConfig } = require('./process/handle_config')
const { saveDeployConfig } = require('./process/save_deploy_config')

start()

async function start() {
  try {
    const project = USE_PRO = await chooseProject()
    const config = await getProConfig(project)
    const hadleRes = await handleConfig(config)
    await saveDeployConfig(hadleRes)
  } catch (e) {
    logError(e.message)
  }
}
