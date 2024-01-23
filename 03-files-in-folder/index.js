const fs = require("fs");
const path = require("path");

const filesPath = path.join(__dirname, "secret-folder");

fs.readdir(filesPath, (err, files) => {
    if (err) {
        console.error("Error", err);
        return
    }
    console.log("There are files in this directory:");
    files.forEach(file => {
        fs.stat(filesPath + "\\" + file, (err, stats) => {
            if (err) {
                console.error(err);
                return;
            }
            if (stats.isFile() === true) {

                let extNameWithPoint = path.extname(file);
                let extNameArray = Array.from(extNameWithPoint);
                extNameArray.shift();
                let extNameWithoutPoint = extNameArray.join("");

                let fileName = path.parse(file).name;

                let fileSize = Math.round(stats.size / 1024) + "kb";
                console.log(fileName + " - " + extNameWithoutPoint + " - " + fileSize);
            }
        })
    });
});