const fs = require('fs');
const logger = require("../logger.js");


class FileManager {
    fileModel;
    constructor() {
        this.fileModel = require('../models/file.js');
    }
    insertFile = async (name) => {
        await this.fileModel.insertFile(name);
    }
}

module.exports = new FileManager();
