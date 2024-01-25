const fs = require('fs').promises;
const path = require('path');

async function createProjectDirectory() {
    try {
        const currentDirectory = __dirname;

        const directoryName = 'project-dist';
        const templateFileName = 'template.html';
        const componentsDirectoryName = 'components';
        const stylesDirectoryName = 'styles';
        const assetsDirectoryName = 'assets';

        const projectDirectoryPath = path.join(currentDirectory, directoryName);
        const templateFilePath = path.join(currentDirectory, templateFileName);
        const componentsFolderPath = path.join(currentDirectory, componentsDirectoryName);
        const stylesFolderPath = path.join(currentDirectory, stylesDirectoryName);
        const assetsFolderPath = path.join(currentDirectory, assetsDirectoryName);
        const indexFilePath = path.join(projectDirectoryPath, 'index.html');
        const styleFilePath = path.join(projectDirectoryPath, 'style.css');
        const destinationAssetsPath = path.join(projectDirectoryPath, assetsDirectoryName);

        const isDirectoryExists = await directoryExists(projectDirectoryPath);
        if (isDirectoryExists) {
            await fs.rmdir(projectDirectoryPath, { recursive: true });
        }
        await fs.mkdir(projectDirectoryPath);
        console.log(`Directory "${directoryName}" created successfully.`);

        const templateContent = await fs.readFile(templateFilePath, 'utf-8');
        const filesInComponents = await fs.readdir(componentsFolderPath);
        let processedContent = templateContent;

        for (const fileName of filesInComponents) {
            const componentName = path.parse(fileName).name;
            const tagToReplace = new RegExp(`{{${componentName}}}`, 'g');
            const componentFilePath = path.join(componentsFolderPath, fileName);

            try {
                const componentContent = await fs.readFile(componentFilePath, 'utf-8');
                processedContent = processedContent.replace(tagToReplace, componentContent);
            } catch (error) {
                console.error(`Error reading component file "${fileName}": ${error.message}`);
            }
        }

        await fs.writeFile(indexFilePath, processedContent, 'utf-8');
        console.log(`File "${indexFilePath}" created successfully.`);

        const filesInStyles = await fs.readdir(stylesFolderPath);
        let combinedStyleContent = '';

        for (const cssFileName of filesInStyles) {
            if (path.extname(cssFileName).toLowerCase() === '.css') {
                const cssFilePath = path.join(stylesFolderPath, cssFileName);
                try {
                    const cssContent = await fs.readFile(cssFilePath, 'utf-8');
                    combinedStyleContent += cssContent + '\n';
                } catch (error) {
                    console.error(`Error reading CSS file "${cssFileName}": ${error.message}`);
                }
            }
        }

        await fs.writeFile(styleFilePath, combinedStyleContent, 'utf-8');
        console.log(`File "${styleFilePath}" created successfully.`);

        await copyDirectory(assetsFolderPath, destinationAssetsPath);
        console.log(`Directory "${assetsDirectoryName}" and its contents copied successfully.`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

async function copyDirectory(source, destination) {
    if (!(await directoryExists(destination))) {
        await fs.mkdir(destination);
    }

    const files = await fs.readdir(source);

    for (const file of files) {
        const sourcePath = path.join(source, file);
        const destinationPath = path.join(destination, file);

        const isDirectory = (await fs.stat(sourcePath)).isDirectory();

        if (isDirectory) {
            await copyDirectory(sourcePath, destinationPath);
        } else {
            await fs.copyFile(sourcePath, destinationPath);
        }
    }
}

async function directoryExists(directoryPath) {
    try {
        const stats = await fs.stat(directoryPath);
        return stats.isDirectory();
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
}

createProjectDirectory();



