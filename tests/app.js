const fs = require('fs');
const path = require('path');
const Mocha = require('mocha');
const neek = require('neek');
// Instantiate a Mocha with options
const mocha = new Mocha({
  reporter: 'list'
});
// Use non-default Mocha test directory.
process.chdir('tests');
let currentDirectory = process.cwd();
let rootBaseFolder = `${currentDirectory}/base`;
let baseFolder = `${currentDirectory}/base`;
let rootClientFolder = `${currentDirectory}/client`;
let clientFolder = `${currentDirectory}/client`;
// check for directory exists
function checkInClientFolder(folderName){
  if(fs.existsSync(`${folderName}`)){
    return true;
  }
  return false;
}
const getAllFiles = function(baseFolder, arrayOfFiles) {
  fs.readdirSync(baseFolder,{withFileTypes: true}).forEach((file) => {
    let deepPath = baseFolder.slice(rootBaseFolder.length);
    arrayOfFiles = arrayOfFiles || [];
      if(checkInClientFolder(rootClientFolder + deepPath)){
        if (fs.statSync(baseFolder + "/" + file.name).isDirectory()) {
          arrayOfFiles = getAllFiles(baseFolder + "/" + file.name, arrayOfFiles);
        } else {
          let finalDirectoryPath = baseFolder.replace('base', 'final');
          fs.mkdirSync(finalDirectoryPath, {recursive: true});
          let baseFolderData = fs.readFileSync(baseFolder + '/' + file.name, {encoding:'utf8', flag:'r'});
          let clientFolderData = fs.readFileSync(rootClientFolder + deepPath + '/' + file.name, {encoding:'utf8', flag:'r'});
          let writer = fs.createWriteStream(finalDirectoryPath + '/' + file.name);
          let mergedData;
          if(file.isFile() && file.name.indexOf('config.json') > -1){
              baseFolderData = baseFolderData ? JSON.parse(baseFolderData): '';
              clientFolderData = clientFolderData ? JSON.parse(clientFolderData): '';
              mergedData = {...baseFolderData, ...clientFolderData};
              writer.write(mergedData ? JSON.stringify(mergedData): '');
          } else {
              mergedData =baseFolderData + clientFolderData;
              mergedData = mergedData
                  .split("\n")
                  .filter((item, index, allItems) => {
                    return (index === allItems.indexOf(item) || (item.indexOf('import') != -1 ||
                           item.indexOf('require') != -1));
                  })
                  .join("\n");
                  writer.write(mergedData);
          }
          arrayOfFiles.push(path.join(baseFolder, "/", file.name));
        }
      }
  })
  return arrayOfFiles;
}
console.log(getAllFiles(baseFolder));

// Add each .js file to the mocha instance
// fs.readdirSync(testDir)
//   .filter(function(file) {
//     return path.extname(file) === '.js';
//   })
//   .forEach(function(file) {
//     mocha.addFile(path.join(testDir, file));
//   });

// Run the tests.
// mocha.run(function(failures) {
//   process.exitCode = failures ? 1 : 0; // exit with non-zero status if there were failures
// });