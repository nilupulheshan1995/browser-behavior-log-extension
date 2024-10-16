const fs = require('fs');
const path = require('path');


function saveJsonFile(filePath, data) {
  const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON string with indentation

  fs.writeFile(filePath, jsonData, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log(`JSON data saved to ${filePath}`);
  });
}

function pushtoArray(filename, newJsonObject) {
  let data = [];
  try {
      // Check if the file exists
      if (fs.existsSync(filename)) {
          // If it exists, read the existing JSON file
          data = JSON.parse(fs.readFileSync(filename));
          
          // If the existing data is not an array, make it an array
          if (!Array.isArray(data)) {
              data = [];
          }
      }
  } catch (err) {
      // Handle file read error
      console.error('Error reading file:', err);
  }
  
  // Push the new object into the array
  data.push(newJsonObject);
  
  // Write the updated data back to the file
  saveJsonFile(filename, data);
}

function saveJsonFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

function readJsonFilesInFolder(folderPath) {
  let jsonContents = [];

  // Read the contents of the folder
  fs.readdirSync(folderPath).forEach(file => {
      const filePath = path.join(folderPath, file);

      // Check if the file is a JSON file
      if (path.extname(filePath) === '.json') {
          try {
              // Read the JSON file content and parse it
              const content = JSON.parse(fs.readFileSync(filePath));
              jsonContents.push(content);
          } catch (err) {
              console.error(`Error reading JSON file ${filePath}:`, err);
          }
      }
  });

  return jsonContents;
}

module.exports = {pushtoArray,saveJsonFile,readJsonFilesInFolder}