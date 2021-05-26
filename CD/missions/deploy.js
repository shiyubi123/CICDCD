const archiver = require('archiver');
const fs = require('fs')
const path = require('path')
const { createMissionFunc, startMission } = require('../common')
const { remoteFilePath, remoteDirPath } = require('../config')
const localPath = path.resolve(__dirname, './../../dist.zip')
const prompts = require('prompts');

(async () => {
  let response = await prompts({
    type: 'confirm',
    name: 'deploy',
    message: '是否决定部署? (y/n)'
  })
  if (response.deploy) {
    response = await prompts({
      type: 'confirm',
      name: 'cover',
      message: '是否进行覆盖? (y/n)'
    })
    const missionFunc = response.cover ? createMissionFunc(coverDeploy) : createMissionFunc(deploy)
    await startMission(missionFunc)
    process.exit(0)
  }
})()

async function coverDeploy(runCommand, sshConfig, ssh) {
  await startZip('dist')
  await uploadFile(ssh, sshConfig)
  await unzipFile(runCommand, sshConfig)
  process.exit(0)
}
async function deploy(runCommand, sshConfig, ssh) {
  const rollbackFileName = ('index.html.' + new Date().toLocaleDateString()).replace(/\//g, '-') + '-' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
  await startZip('dist')
  await uploadFile(ssh, sshConfig)
  // for the possible rollback in the future
  await runCommand(`cp -a index.html ${rollbackFileName}`, remoteDirPath)
  await unzipFile(runCommand, sshConfig)
  await deleteOldestFile(runCommand)
  process.exit(0)
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
        console.log(`close archiver error ${err}`)
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
    console.log(`压缩文件上传失败 \n${err}`)
    process.exit(1)
  }
}
// unzip
async function unzipFile(runCommand, sshConfig) {
  try {
    await runCommand(`unzip -o dist.zip && rm -f dist.zip`, remoteDirPath);
    console.log(`${sshConfig.name} 部署成功`);
  } catch (err) {
    console.log(`解压失败 ${err}`)
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