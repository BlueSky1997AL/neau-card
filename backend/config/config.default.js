'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1509810737269_8364';

  // add your config here
  config.middleware = [];

  config.login = {
    serverUrl: 'http://card.neau.edu.cn/',
  };

  config.curlOpts = {
    // Enable proxy when needed
    enableProxy: true,
    proxy: 'http://cyf.feit.me:6000',
    timeout: [ '30s', '30s' ],
  };

  config.static = {
    prefix: '/',
  };

  return config;
};
