// const file = (config, logger) => {
const config = require('config');
const logger = require('../logger.js');
const mongoose = require('mongoose');
const uuid = require('uuid');

mongoose.connect(config.mongoUrl);

const fileSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true }
})

fileSchema.statics.insertFile = (name) => {
    const id = uuid.v4();
    const newFile = new File({ 'name': name, 'id': id });
    newFile.save((err) => {
        if (err) {
            logger.error(`Error saving file - ${err}`);
        }
    })
}
// }
const File = mongoose.model('file', fileSchema)
module.exports = File;