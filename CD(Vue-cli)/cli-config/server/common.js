const NodeSSH = require('node-ssh');
const { serverConfig } = require('./config')
const serverSSHConfigs = require('./../config/server/ssh.json')
let sshConfigs = getSSHConfigs()

function getSSHConfigs() {
  const ary = []
  serverConfig.sshConfig.forEach(item => {
    ary.push(serverSSHConfigs[item])
  })
  return ary
}

async function connectSSH(sshConfig) {
  const ssh = new NodeSSH()
  try {
    await ssh.connect(sshConfig)
    logSuccess(`\n${sshConfig.name} ssh连接成功`)
  } catch (err) {
    logError(`ssh连接失败 ${err}`)
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

