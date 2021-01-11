const nextTranslate = require('next-translate')
const withTM = require('next-transpile-modules')(['antd']); // pass the modules you would like to see transpiled

module.exports = withTM();
module.exports = nextTranslate()