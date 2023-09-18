module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);
  //Used to instrument code ran like unit tests
  on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'));
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.family === 'chromium') {
      console.log('Adding Chrome flag: --disable-dev-shm-usage');
      launchOptions.args.push('--disable-dev-shm-usage');
    }
    return launchOptions;
  });
  return config;
};
