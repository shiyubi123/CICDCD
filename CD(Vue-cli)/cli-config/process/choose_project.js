async function chooseProject() {
  let project
  if (PRO_TYPE === 'Vue') {
    project = await chooseVueProject()
    return project.name
  } else {
    project = await choosePureWebs()
    return project
  }

  async function chooseVueProject() {
    let project
    return new Promise(async (resolve) => {
      project = (await ask([createQueryQuestion()])).dir
      if (project.type !== 'Vue') {
        CUR_PATH = path.resolve(CUR_PATH, project.name)
        project = await chooseVueProject()
      }
      resolve(project)
    })
  }

  async function choosePureWebs() {
    let project
    return new Promise(async (resolve) => {
      project = (await ask([createQueryQuestion()])).dir
      if (project[0].type !== 'pureWeb') {
        CUR_PATH = path.resolve(CUR_PATH, project[0].name)
        project = await choosePureWebs()
      }
      resolve(project)
    })
  }
}

function createQueryQuestion() {
  return {
    name: 'dir',
    type: PRO_TYPE === 'Vue' ? 'list' : 'checkbox',
    choices: [...getCurDirs(path.resolve(CUR_PATH), handleFunc)],
    validate: (dirs) => {
      if (dirs.length < 1) return '至少需要一个选项'
      if (dirs.length > 1 && dirs.some(dir => dir.type === 'normal')) return '你只能选多个pureWeb'
      return true
    }
  }
}

function getCurDirs(dirpath, handleFunc) {
  const dir = fs.readdirSync(dirpath)
  const dirsIndir = dir.filter(dir => isDir(path.resolve(dirpath, dir)))
  const dirChoices = handleFunc(dirsIndir)
  if (!handleFunc) dirChoices.unshift('..')
  return dirChoices
}

function handleFunc(dirsIndir) {
  const handledDirs = dirsIndir.map(dirName => {
    return {
      name: dirName,
      type: getProjectType(dirName),
    }
  })
  const dirChoices = handledDirs.map((dir) => {
    let res = {
      value: dir
    }
    if (PRO_TYPE === 'Vue') {
      res.name = dir.type === 'Vue' ? dir.name + ' (Vue)' : dir.name
    } else {
      res.name = dir.type === 'pureWeb' ? dir.name + ' (pureWeb)' : dir.name
    }
    return res
  })
  dirChoices.unshift({
    value: { name: '..', type: 'normal' },
    name: '..'
  })
  return dirChoices
}

function getProjectType(dir) {
  if (isVueProject(dir)) return 'Vue'
  if (isPureWeb(dir)) return 'pureWeb'
  return 'normal'
}

module.exports = { chooseProject }