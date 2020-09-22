import fs from 'fs';
process.chdir('tests');
let currentDirectory = process.cwd();
let rootBaseFolder = `${currentDirectory}/base`;
let rootClientFolder = `${currentDirectory}/client`;
let rootFinalFolder = `${currentDirectory}/final`;
const globalTestConfigName = 'global-test-config.json';
const featureTestConfigName = 'test-config.json';
const programTestConfigName = 'program-test-config.json';

function getMergedJsonObject(baseData, clientData){
  const baseJsonData = baseData ? JSON.parse(baseData): '';
  const clientJsonData = clientData ? JSON.parse(clientData): '';
  const mergedData = {...baseJsonData, ...clientJsonData};
  return mergedData;
}

function getMergedTestConfig(rootBaseFolder, rootClientFolder, configName){
  let baseConfigData;
  let clientConfigData;
  if(fs.existsSync(rootBaseFolder)){
    baseConfigData = fs.readFileSync(rootBaseFolder + '/' + configName, {encoding:'utf8', flag:'r'});
  }
  if(fs.existsSync(rootClientFolder)){
    clientConfigData = fs.readFileSync(rootClientFolder + '/' + configName, {encoding:'utf8', flag:'r'});
  }
  const mergedJsonObject = getMergedJsonObject(baseConfigData, clientConfigData);
  const returnData = {
    fileName: configName,
    mergedData: mergedJsonObject
  };
  return returnData;
}

function writeInFinalFolder (directoryPath, writableData){
  if(!fs.existsSync(directoryPath + '/' + writableData.fileName)){
    fs.mkdirSync(directoryPath, {recursive: true});
    fs.writeFileSync(directoryPath + '/' + writableData.fileName, 
            JSON.stringify(writableData.mergedData));
  }
}
function writeTestFilesToFinalFolder(featureFolderPath, arrayOfFiles){
  fs.readdirSync(featureFolderPath, {withFileTypes: true}).forEach((file) => {
    let deepPath = featureFolderPath.slice(currentDirectory.length);
    arrayOfFiles = arrayOfFiles || [];
    if (fs.statSync(featureFolderPath + "/" + file.name).isDirectory()) {
      arrayOfFiles = writeTestFilesToFinalFolder(featureFolderPath + "/" + file.name, arrayOfFiles);
    }else{
      deepPath = deepPath.indexOf('/base') == 0 ? deepPath.replace('/base', '') : 
          deepPath.indexOf('/client') == 0 ? deepPath.replace('/client', ''): deepPath;
      const finalDirectoryPath = rootFinalFolder + deepPath;
      if(!fs.existsSync(finalDirectoryPath)){
        fs.mkdirSync(finalDirectoryPath, {recursive: true});
      }
      if(file.isFile() && file.name.indexOf('config.json') == -1){
        fs.copyFileSync(featureFolderPath + '/' + file.name, finalDirectoryPath + '/' + file.name);
      }
    }
  });
}
function writeTestFilesOfBaseAndClientRecursively(baseFeatureFolder, clientFeatureFolder, featureFolder){
  writeTestFilesToFinalFolder(baseFeatureFolder);
  writeTestFilesToFinalFolder(clientFeatureFolder);
  const mergedFeatureConfigTestData = getMergedTestConfig(baseFeatureFolder , clientFeatureFolder, featureTestConfigName);
  writeInFinalFolder(rootFinalFolder + '/'+ featureFolder, mergedFeatureConfigTestData);
}
function writeFeatureFolderToFinalFolder (rootBaseFolder, rootClientFolder, featureFolderName){
  const baseFeatureFolder = rootBaseFolder + '/' + featureFolderName;
  const clientFeatureFolder = rootClientFolder + '/' + featureFolderName;
  if(fs.existsSync(clientFeatureFolder)){
      writeTestFilesOfBaseAndClientRecursively(baseFeatureFolder, clientFeatureFolder, featureFolderName);
  }else{
    writeTestFilesToFinalFolder(baseFeatureFolder);
  }
}
function removeFinalFolder(){
  if(fs.existsSync(rootFinalFolder)){
   fs.rmdirSync(rootFinalFolder,{recursive: true});
  }
}
function getGlobalConfigData(rootFolderPath, configName){
  let configData;
  if(fs.existsSync(rootFolderPath)){
    configData = fs.readFileSync(rootFolderPath + '/' + configName, {encoding:'utf8', flag:'r'});
  }
  const globalConfigDataJson = configData ? JSON.parse(configData): '';
  return globalConfigDataJson;
}
function writeFeatureFilesToFinalFolder(specificFeatureFolder, arrayOfFiles) {
  fs.readdirSync(specificFeatureFolder, {withFileTypes: true}).forEach((file) => {
    let deepPath = specificFeatureFolder.slice(currentDirectory.length);
    arrayOfFiles = arrayOfFiles || [];
    if (fs.statSync(specificFeatureFolder + "/" + file.name).isDirectory()) {
      arrayOfFiles = writeFeatureFilesToFinalFolder(specificFeatureFolder + "/" + file.name, arrayOfFiles);
    }else{
      // deepPath = deepPath.indexOf('/base') == 0 ? deepPath.replace('/base', '') : 
      //     deepPath.indexOf('/client') == 0 ? deepPath.replace('/client', ''): deepPath;
      const finalDirectoryPath = rootFinalFolder + deepPath;
      if(!fs.existsSync(finalDirectoryPath)){
        fs.mkdirSync(finalDirectoryPath, {recursive: true});
      }
      fs.copyFileSync(specificFeatureFolder + '/' + file.name, finalDirectoryPath + '/' + file.name);
    }
  });
}
function writeFilesToFinalDirectory(featuresFolder, featureConfig){
  const specificFeatureFolder = featuresFolder + '/' + featureConfig[0];
  writeFeatureFilesToFinalFolder(specificFeatureFolder);

}
function readFilesFromProgramDirectory(object, rootFinalFolder){
  const directoryName = object[0];
  const featuresFolder = rootClientFolder + '/' + directoryName;
  const programTestConfigJson = fs.readFileSync(featuresFolder + '/' + programTestConfigName, {encoding:'utf8', flag:'r'});
  const programTestConfigArray = programTestConfigJson ? Object.entries(JSON.parse(programTestConfigJson)): [];
  programTestConfigArray.forEach(featureConfig => {
    if(featureConfig[1]){
      writeFilesToFinalDirectory(featuresFolder , featureConfig);
    }
  })
}
function createFinalFolderWithGlobalConfig(rootBaseFolder, rootClientFolder){
  removeFinalFolder();
  const baseGlobalConfigDataJson = getGlobalConfigData(rootBaseFolder, globalTestConfigName);
  const clientGlobalConfigDataJson = getGlobalConfigData(rootClientFolder, globalTestConfigName);
  const baseGlobalConfigDataArray = Object.entries(baseGlobalConfigDataJson);
  const clientGlobalConfigDataArray = Object.entries(clientGlobalConfigDataJson);
  const mergedGlobalConfigTestData = {
    fileName: globalTestConfigName,
    mergedData: {...baseGlobalConfigDataJson, ...clientGlobalConfigDataJson}
  };
  clientGlobalConfigDataArray.forEach(data => {
    const innerObjArray = Object.entries(data[1]);
    innerObjArray.forEach(innerObj => {
      console.log(innerObj);
      if(innerObj[1]){
        readFilesFromProgramDirectory(innerObj, rootFinalFolder);
      }
    })
  })
  // const mergedGlobalConfigTestData = getMergedTestConfig(rootBaseFolder, rootClientFolder, globalTestConfigName);
  writeInFinalFolder(rootFinalFolder , mergedGlobalConfigTestData);
  //const globalConfigDataArray = Object.entries(mergedGlobalConfigTestData.mergedData);
  
  // globalConfigDataArray.forEach(featureFolder => {
  //   console.log(featureFolder);
  //   if(featureFolder[1]){
  //     writeFeatureFolderToFinalFolder(rootBaseFolder, rootClientFolder, featureFolder[0]);
  //   }
  // });
}

createFinalFolderWithGlobalConfig(rootBaseFolder, rootClientFolder);

// function generateTestPlaylist(){
//   const globalConfigData = fs.readFileSync(rootFinalFolder + '/' + globalTestConfigName, {encoding:'utf8', flag:'r'});
//   const jsonGlobalConfigData = globalConfigData ? JSON.parse(globalConfigData): '';
//   const globalConfigDataArray = Object.entries(jsonGlobalConfigData);
//   globalConfigDataArray.forEach(function(data) {
//     if(data[1]){
//       let fileData = fs.readFileSync(rootFinalFolder + `/${data[0]}/` + featureTestConfigName,{encoding:'utf8', flag:'r'});
//       jsonGlobalConfigData[data[0]] = JSON.parse(fileData);
//     }
//   });
//   fs.writeFileSync(process.cwd() + '/testPlaylist.json', JSON.stringify(jsonGlobalConfigData));
// }

// generateTestPlaylist();