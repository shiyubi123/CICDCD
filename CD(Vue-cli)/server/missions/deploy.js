require('./../../global/log')
const archiver = require('archiver')
const fs = require('fs')
const path = require('path')
const { createMissionFunc, startMission } = require('../common')
const prompts = require('prompts')
const { serverConfig, curPath, usePro, proType } = require('../config.json')

let localPath, remoteDirPath, remoteFilePath
startDeploy()

async function startDeploy() {
  if (proType === 'pureWeb') {
    await deployPureWebs()
    logSuccess(`Webpage is deployed successfully!`)
  } else {
    localPath = path.resolve(__dirname, './../../../dist.zip')
    remoteDirPath = serverConfig.pathConfig + '/' + usePro
    remoteFilePath = remoteDirPath + '/dist.zip'
    await deployProjects()
    logSuccess(`${usePro} is deployed successfully!`)
  }
  process.exit(0)
}

async function deployProjects() {
  response = await prompts({
    type: 'confirm',
    name: 'cover',
    message: 'Whether to cover ? (y/n)'
  })
  const missionFunc = response.cover ? createMissionFunc(coverDeploy) : createMissionFunc(deploy)
  await startMission(missionFunc)
}

async function deployPureWebs() {
  const missionFunc = createMissionFunc(async function (runCommand, sshConfig, ssh) {
    const promiseAry = []
    try {
      for (let i = 0; i < usePro.length; i++) {
        const promiseMission = await ssh.putDirectory(`${path.resolve(curPath, usePro[i].name)}`, `${serverConfig.pathConfig + '/' + usePro[i].name}`, {
          recursive: true
        })
        promiseAry.push(promiseMission)
      }
      await Promise.all(promiseAry)
    } catch (err) {
      logError(`Deploy webpage failed \n${err}`)
      process.exit(1)
    }
  })
  await startMission(missionFunc)
}

async function coverDeploy(runCommand, sshConfig, ssh) {
  await startZip('dist')
  await uploadFile(ssh, sshConfig)
  await unzipFile(runCommand, sshConfig)
}
async function deploy(runCommand, sshConfig, ssh) {
  const rollbackFileName = ('index.html.' + new Date().toLocaleDateString()).replace(/\//g, '-') + '-' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
  await startZip('dist')
  await uploadFile(ssh, sshConfig)
  // for the possible rollback in the future
  await runCommand(`cp -a index.html ${rollbackFileName}`, remoteDirPath)
  await unzipFile(runCommand, sshConfig)
  await deleteOldestFile(runCommand)
}
// pack and create zip file
function startZip() {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 }
    }).on('error', err => {
      throw err
    });

    const output = fs.createWriteStream('dist.zip')
    output.on('close', err => {
      if (err) {
        logError(`Compression error to closed： ${err}`)
        reject(err)
        process.exit(1)
      }
      resolve();
    });
    archive.pipe(output);
    archive.directory('dist', '/')
    archive.finalize()
  });
}
// upload zip file
async function uploadFile(ssh, sshConfig) {
  try {
    await ssh.putFile(`${localPath}`, `${remoteFilePath}`);
  } catch (err) {
    logError(`Upload file failed： \n${err}`)
    process.exit(1)
  }
}
// unzip
async function unzipFile(runCommand, sshConfig) {
  try {
    await runCommand(`unzip -o dist.zip && rm -f dist.zip`, remoteDirPath);
  } catch (err) {
    logError(`Unzip file failed ${err}`)
    process.exit(1)
  }
}
//delete last file
async function deleteOldestFile(runCommand) {
  const result = await runCommand('ls -a -t', remoteDirPath)
  const fileAry = result.stdout.split('\n').filter(item => item.indexOf('html') > 0)
  if (fileAry.length > 5) {
    const lastFile = fileAry[fileAry.length - 1]
    await runCommand(`rm ${lastFile}`, remoteDirPath)
  }
}

module.exports = { startDeploy }