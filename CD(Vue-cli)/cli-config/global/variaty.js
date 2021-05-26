global.PRO_TYPE = process.argv[2] ? process.argv[2] : 'pureWeb'
global.CUR_PATH = PRO_TYPE === 'Vue' ? path.resolve(__dirname, '../../src/pages') : path.resolve(__dirname, '../../src/pureWeb')
global.USE_ENV = process.argv[3] ? process.argv[3] : 'production'
global.USE_PRO = ''