const PRO_PATH = './'
const WEB_PATH = './'

global.USE_PRO = ''
global.PRO_TYPE = process.argv[2] ? process.argv[2] : 'pureWeb'
global.USE_ENV = process.argv[3] ? process.argv[3] : 'production'
global.CUR_PATH = PRO_TYPE === 'Vue' ? path.resolve(__dirname, PRO_PATH) : path.resolve(__dirname, WEB_PATH)