const path = require('path');
module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      'stores': path.resolve(__dirname, 'stores'),
      'hooks': path.resolve(__dirname, 'hooks'),
      'models': path.resolve(__dirname, 'models'),
      'shared': path.resolve(__dirname, 'shared'),
      'components': path.resolve(__dirname, 'components'),
    },
  };
return config;
};