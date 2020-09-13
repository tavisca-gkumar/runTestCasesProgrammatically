import fs from 'fs';
import path from 'path';
import mocha from 'mocha';
// Instantiate a Mocha with options
// const mocha = new Mocha({
//   reporter: '',
// });
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
          if(file.isFile() && file.name.indexOf('config.json') > -1){
            let writer = fs.createWriteStream(finalDirectoryPath + '/' + file.name);
            baseFolderData = baseFolderData ? JSON.parse(baseFolderData): '';
            clientFolderData = clientFolderData ? JSON.parse(clientFolderData): '';
            const mergedData = {...baseFolderData, ...clientFolderData};
            writer.write(mergedData ? JSON.stringify(mergedData): '');
          }else{
            fs.copyFileSync(baseFolder + '/' + file.name,finalDirectoryPath + '/' + file.name);
            fs.copyFileSync(rootClientFolder + deepPath +'/' + file.name , finalDirectoryPath +  '/client-' +file.name);
          }
          arrayOfFiles.push(path.join(baseFolder, "/", file.name));
        }
      }
  })
  return arrayOfFiles;
}
console.log(getAllFiles(baseFolder));

// function getTestFilePaths(dir, fileList) {
//   var files = fs.readdirSync(dir);
//   fileList = fileList || [];
//   files.forEach(function(file) {
//       if (fs.statSync(path.join(dir, file)).isDirectory()) {
//           fileList = getTestFilePaths(path.join(dir, file), fileList);
//       } else {
//           fileList.push(path.join(dir, file));
//       }
//   });

//   return fileList.filter(function (file) {
//       return path.extname(file) === '.ts';
//   });
// }

// // Add each .js file to the mocha instance
// const testDir = `${currentDirectory}/final`;

// getTestFilePaths(testDir).forEach(function(file) {
//   mocha.addFile(
//       path.join(file)
//   );
// });
// //Run the tests.
// mocha.run(function(failures) {
//   process.exitCode = failures ? 1 : 0; // exit with non-zero status if there were failures
// });