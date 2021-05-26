const { createMissionFunc, startMission } = require('../common')
const { remoteDirPath } = require('../config')

const missionFunc = createMissionFunc(rollback)
startMission(missionFunc).then(res => {
  process.exit(0)
}).catch(error => {
  console.log(error)
  process.exit(1)
})

async function rollback(runCommand, sshConfig) {
  await checkIfCanRollback(runCommand)
  // remove new file first
  await runCommand('rm index.html', remoteDirPath)
  // get latest file
  const dirFiles = await runCommand('ls -a -t', remoteDirPath)
  const latestFile = dirFiles.stdout.split('\n').filter(item => item.indexOf('html') > 0)[0]
  // change name to rollback
  await runCommand(`mv ${latestFile} index.html`, remoteDirPath)
  console.log(`${sshConfig.name} 回滚成功!`)
}

async function checkIfCanRollback(runCommand) {
  const dirFiles = await runCommand('ls -a -t', remoteDirPath)
  const fileAry = dirFiles.stdout.split('\n').filter(item => item.indexOf('html') > 0)
  if (fileAry.length <= 1) {
    console.log('该项目不存在可回滚的文件')
    process.exit(1)
  }
}
