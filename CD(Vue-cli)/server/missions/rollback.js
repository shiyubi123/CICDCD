requireGlobal()
let remoteDirPath, spinner

start()
async function start() {
  await preHandle()
  spinner = ora('Rolling back...').start()
  const { createMissionFunc, startMission } = await require('../common')

  const missionFunc = createMissionFunc(rollback)
  startMission(missionFunc).then(res => {
    spinner.stop()
    process.exit(0)
  }).catch(error => {
    console.log(error)
    spinner.stop()
    process.exit(1)
  })

  async function preHandle() {
    const { chooseProject } = await require('./../../process/choose_project')
    const project = await chooseProject()
    const rollbackConfig = await handleProject(project)
    await saveJson(rollbackConfig, path.resolve(__dirname, './server/config.json'))
  }
  async function handleProject(project) {
    const serverConfigs = require('./../../config/server.json')
    remoteDirPath = serverConfigs[project].pathConfig + '/' + project

    const handleRes = {
      serverConfig: serverConfigs[project],
      usePro: project,
      proType: 'Vue',
      curPath: CUR_PATH
    }
    return handleRes
  }
}

async function rollback(runCommand, sshConfig) {
  await checkIfCanRollback(runCommand)
  // remove new file first
  await runCommand('rm index.html', remoteDirPath)
  // get latest file
  const dirFiles = await runCommand('ls -a -t', remoteDirPath)
  const fileAry = dirFiles.stdout.split('\n').filter(item => item.indexOf('html') > 0)
  const latestFile = fileAry[0]
  // change name to rollback
  await runCommand(`mv ${latestFile} index.html`, remoteDirPath)
  logSuccess(`${sshConfig.name} rollback successful!`)
}

async function checkIfCanRollback(runCommand) {
  const dirFiles = await runCommand('ls -a -t', remoteDirPath)
  const fileAry = dirFiles.stdout.split('\n').filter(item => item.indexOf('html') > 0)
  if (fileAry.length <= 1) {
    logError('There is no file for rollback')
    spinner.stop()
    process.exit(1)
  }
}

function requireGlobal() {
  require('./../../global/util.js')
  require('./../../global/variaty')
  require('./../../global/log.js')
  require('./../../global/dir.js')
  require('./../../global/inquirer.js')
}