const { NodeSSH } = require('node-ssh');
const { sshConfigs } = require('./config')

async function connectSSH(sshConfig) {
  const ssh = new NodeSSH()
  try {
    await ssh.connect(sshConfig)
    console.log(`${sshConfig.name} ssh连接成功`)
  } catch (err) {
    console.log(`ssh连接失败 ${err}`)
    process.exit(1)
  }
  return ssh
}

function createRunCommandFunc(ssh) {
  return async function runCommand(command, remotePath) {
    return await ssh.execCommand(command, {
      cwd: remotePath
    })
  }
}

function createMissionFunc(mission) {
  return async function start(sshConfig) {
    const ssh = await connectSSH(sshConfig)
    const runCommand = createRunCommandFunc(ssh)
    await mission(runCommand, sshConfig, ssh)
  }
}

function startMission(start) {
  let missionArray = []
  sshConfigs.forEach(sshConfig => {
    missionArray.push(start(sshConfig))
  })
  return Promise.all(missionArray)
}

module.exports = { createMissionFunc, startMission }

