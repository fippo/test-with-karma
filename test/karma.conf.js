const os = require('os');

let browsers;
if (process.env.BROWSER) {
  if (process.env.BROWSER === 'safari') {
    browsers = ['Safari'];
  } else if (process.env.BROWSER === 'Electron') {
    browsers = ['electron'];
  } else {
    browsers = [process.env.BROWSER];
  }
} else if (os.platform() === 'darwin') {
  browsers = ['chrome', 'firefox', 'Safari'];
} else if (os.platform() === 'win32') {
  browsers = ['chrome', 'firefox'];
} else {
  browsers = ['chrome', 'firefox'];
}

let reporters = ['mocha'];

// uses Safari Technology Preview.
if (os.platform() === 'darwin' && process.env.BVER === 'unstable' &&
    !process.env.SAFARI_BIN) {
  process.env.SAFARI_BIN = '/Applications/Safari Technology Preview.app' +
      '/Contents/MacOS/Safari Technology Preview';
}

if (!process.env.FIREFOX_BIN) {
  process.env.FIREFOX_BIN = process.cwd() + '/browsers/bin/firefox-'
      + (process.env.BVER || 'stable');
}
if (!process.env.CHROME_BIN) {
  process.env.CHROME_BIN = process.cwd() + '/browsers/bin/chrome-'
      + (process.env.BVER || 'stable');
}

let chromeFlags = [
  '--use-fake-device-for-media-stream',
  '--use-fake-ui-for-media-stream',
  '--no-sandbox',
  '--headless', '--disable-gpu', '--remote-debugging-port=9222'
];
if (process.env.CHROMEEXPERIMENT !== 'false') {
  chromeFlags.push('--enable-experimental-web-platform-features');
}

module.exports = function(config) {
  config.set({
    basePath: '..',
    frameworks: ['browserify', 'mocha', 'chai'],
    files: [
      'test/getusermedia-mocha.js',
      'test/e2e/*.js',
    ],
    exclude: [],
    reporters,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    customLaunchers: {
      chrome: {
        base: 'Chrome',
        flags: chromeFlags
      },
      electron: {
        base: 'Electron',
        flags: ['--use-fake-device-for-media-stream']
      },
      firefox: {
        base: 'Firefox',
        prefs: {
          'media.navigator.streams.fake': true,
          'media.navigator.permission.disabled': true
        },
        flags: ['-headless']
      }
    },
    singleRun: true,
    concurrency: Infinity,
    browsers,
  });
};