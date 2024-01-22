const fs = require("fs");
const path = require("path");
const { stdin, stdout } = process;

const greetings = " ";
const fileName = "02-write-file.txt";
const filePath = path.join(__dirname, fileName);
console.log("Greetings, stranger! Let's start!");

fs.writeFile(filePath, greetings, (err) => {
    if (err) {
        console.error("Error creating file: ", err);
    } else {
        console.log(`File '${fileName}' has been created`);
        console.log("Now, write any text please:");
    }
});



stdin.on("data", (data) => {
    const dataStringfied = data.toString().trim();
    if (dataStringfied.toLowerCase() === "exit") {
        console.log("Well, see you next time!");
        process.exit();
    } else {
        fs.appendFile(filePath, dataStringfied + "\n", (err) => {
            if (err) {
                console.error("Error appending to file: ", err);
            } else {
                console.log(`Text appended to file '${fileName}'`);
            }
        });
    }
})

process.on("SIGINT", () => {
    console.log("You're playing dirty! Well, see you next time!");
    process.exit();
});
