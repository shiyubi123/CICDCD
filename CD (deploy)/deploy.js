const archiver = require('archiver');
const fs = require('fs')
const path = require('path')
const { createStartMissionFunc, startMission } = require('./common')
const { remoteFilePath, remoteDirPath } = require('./config')
const localPath = path.resolve(__dirname, './../dist.zip')
const prompts = require('prompts');
 
(async () => {
  const response = await prompts({
    type: 'confirm',
    name: 'deploy',
    message: 'Do you want to deploy? (y/n)'
  });
  if (response.deploy) {
    const start = createStartMissionFunc(deploy)
    try {
      await startMission(start)
      process.exit(0)
    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  }
})();

async function deploy(runCommand, sshConfig, ssh) {
  const copyName = 'index.html.' + new Date().toLocaleDateString() + '-' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
  await startZip('dist')
  await uploadFile(ssh, sshConfig)
  // for callback
  await runCommand(`cp -a index.html ${copyName}`, remoteDirPath)
  await unzipFile(runCommand, sshConfig)
  // last handle
  await deleteLastFile(runCommand)
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
      console.log('\nzip pack success')
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
    console.log(`zip file upload failed \n${err}`)
    process.exit(1)
  }
}
// unzip
async function unzipFile(runCommand, sshConfig) {
  try {
    await runCommand(`unzip -o dist.zip && rm -f dist.zip`, remoteDirPath);
    console.log(`${sshConfig.name} deploy success`);
  } catch (err) {
    console.log(`unzip failed ${err}`)
    process.exit(1)
  }
}

//delete last file
async function deleteLastFile(runCommand) {
  const result = await runCommand('ls -a -t', remoteDirPath)
  const fileAry = result.stdout.split('\n').filter(item => item.indexOf('html') > 0)
  if (fileAry.length > 5) {
    const lastFile = fileAry[fileAry.length - 1]
    await runCommand(`rm ${lastFile}`, remoteDirPath)
  }
}
