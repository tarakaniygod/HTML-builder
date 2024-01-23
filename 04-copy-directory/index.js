
const fs = require('fs').promises;
const path = require('path');

const sourceFolder = path.join(__dirname, 'files');
const destinationFolder = path.join(__dirname, 'files-copy');

async function copyFiles() {
  try {

    await fs.mkdir(destinationFolder, { recursive: true });


    const [sourceFiles, destinationFiles] = await Promise.all([
      fs.readdir(sourceFolder),
      fs.readdir(destinationFolder),
    ]);


    const filesToCopy = sourceFiles.filter(file => !destinationFiles.includes(file));

    await Promise.all(filesToCopy.map(async (file) => {
      const sourceFilePath = path.join(sourceFolder, file);
      const destinationFilePath = path.join(destinationFolder, file);

      const stats = await fs.stat(sourceFilePath);

      if (stats.isFile()) {

        const fileContent = await fs.readFile(sourceFilePath);
        await fs.writeFile(destinationFilePath, fileContent);
        console.log(`File ${file} copied successfully!`);
      } else if (stats.isDirectory()) {
        await copyDirectory(sourceFilePath, destinationFilePath);
        console.log(`Directory ${file} copied successfully!`);
      }
    }));

    const filesToRemove = destinationFiles.filter(file => !sourceFiles.includes(file));

    await Promise.all(filesToRemove.map(async (file) => {
      const filePathToRemove = path.join(destinationFolder, file);
      await fs.unlink(filePathToRemove);
      console.log(`File ${file} removed successfully!`);
    }));

    console.log('All files and directories copied successfully!');
  } catch (err) {
    console.error(err);
  }
}

async function copyDirectory(source, destination) {

  await fs.mkdir(destination, { recursive: true });

  const [sourceFiles, destinationFiles] = await Promise.all([
    fs.readdir(source),
    fs.readdir(destination),
  ]);

  const filesToCopy = sourceFiles.filter(file => !destinationFiles.includes(file));

  await Promise.all(filesToCopy.map(async (file) => {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);

    const stats = await fs.stat(sourcePath);

    if (stats.isFile()) {
      const fileContent = await fs.readFile(sourcePath);
      await fs.writeFile(destinationPath, fileContent);
    } else if (stats.isDirectory()) {
    
      await copyDirectory(sourcePath, destinationPath);
    }
  }));
}

copyFiles();
