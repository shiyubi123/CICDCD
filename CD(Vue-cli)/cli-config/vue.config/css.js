const packConfig = require('../config/pack.json')

const project = packConfig[packConfig.usePro]
const detail = project[packConfig.useEnv]
const cssFn = () => {
  let obj = {
    extract: !(detail.decorator.some(item => item === 'noExtract'))
  }
  if (detail.decorator.some(item => item === 'rem')) {
    Object.assign(obj, {
      loaderOptions: {
        postcss: {
          plugins: [
            require('postcss-plugin-px2rem')({
              rootValue: 100
            })
          ]
        }
      }
    })
  }
  return obj
}
module.exports = cssFn
