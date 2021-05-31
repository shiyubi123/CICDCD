global.isDir = function (path) {
  if (path.indexOf('.sys') > 0 || path.indexOf('System Volume Information') > 0) {
    return false
  }
  return fs.statSync(path).isDirectory()
}

global.isVueProject = function (dir) {
  const projectDir = fs.readdirSync(path.resolve(CUR_PATH, dir))
  return projectDir.includes('App.vue') && projectDir.includes('main.js')
}

global.isPureWeb = function (dir) {
  const projectDir = fs.readdirSync(path.resolve(CUR_PATH, dir))
  return projectDir.includes('index.html') && !projectDir.includes('App.vue')
}