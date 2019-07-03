const packager = require("electron-packager");
const fs = require("fs");
const path = require("path");

const options = {
  dir: ".",
  overwrite: true,
  out: "package"
};

const configFileName = "config.json";

function copyConfigFile(destination) {
  const configFilePath = path.join(__dirname, configFileName);
  const absoluteDestinationPath = path.join(destination, configFileName);
  console.log("********");
  console.log(configFilePath);
  console.log(configFileName);
  console.log(destination);
  fs.createReadStream(configFilePath).pipe(fs.createWriteStream(absoluteDestinationPath));
}

async function doPackage() {
  const paths = await packager(options);
  console.log(paths);
  paths.forEach(path => copyConfigFile(path));
}

doPackage();
