const isDev = require("electron-is-dev");
const electron = require("electron");

// const distPath = isDev
//   ? `${process.cwd()}/dist`
//   : `${electron.remote.app.getAppPath()}/dist`;

const distPath = `${electron.remote.app.getAppPath()}/dist`;

module.exports = x => __non_webpack_require__(`${distPath}/${x}`);
