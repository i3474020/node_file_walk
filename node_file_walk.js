const fs = require('fs');
const path = require('path');

const mark = "/ script was here /";

function hasMark(filePath) {
    const [line] = fs
        .readFileSync(filePath, "utf-8")
        .split("\n");

    return line === mark
}

function markFile(filePath) {
    const text = fs
        .readFileSync(filePath)
        .toString()
        .split("\n");

    text.splice(0, 0, mark)

    fs.writeFileSync(filePath, text.join("\n"));
}

function walk(dirPath) {
    function getFiles(_path) {
        fs.readdir(_path, function (err, items) {
            for (let i = 0; i < items.length; i++) {
                const filePath = path.join(_path, items[i]);
                fs.stat(filePath, function (err, stat) {
                    if (stat.isDirectory()) {
                        getFiles(filePath)
                    } else if (stat.isFile()) {
                        if (!hasMark(filePath)) {
                            markFile(filePath)
                        }
                    }
                })
            }
        });
    }

    getFiles(dirPath);
}
