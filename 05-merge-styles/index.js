const fs = require("fs").promises;
const path = require("path");

const filesPath = path.join(__dirname, "styles");
const outputFolderPath = path.join(__dirname, "project-dist");
const outputFilePath = path.join(outputFolderPath, "bundle.css");

async function combineCssFiles() {
  try {
  
    const updateBundle = async () => {

      const files = await fs.readdir(filesPath);

      const combinedText = [];

      console.log("Data from these files has been copied:");

      await Promise.all(files.map(async (file) => {
        const filePath = path.join(filesPath, file);
        const stats = await fs.stat(filePath);

        if (stats.isFile() && path.extname(file).toLowerCase() === ".css") {
          const fileContent = await fs.readFile(filePath, "utf-8");
          combinedText.push(fileContent);
        }
      }));

      await fs.writeFile(outputFilePath, combinedText.join(""), "utf-8");

      console.log(`File bundle.css has been updated in ${outputFolderPath}`);
    };

    await fs.mkdir(outputFolderPath, { recursive: true });

    await updateBundle();

    fs.watch(filesPath, { recursive: true }, async () => {
      await updateBundle();
    });
  } catch (err) {
    console.error(err);
  }
}

combineCssFiles();

