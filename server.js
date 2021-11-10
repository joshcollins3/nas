// switch (process.env.NODE_ENV) {
//     case 'local':
//         config = require('./config/local.json');
//         break;
//     case 'tunnel':
//         config = require('./config/tunnel.json');
//         break;
// }

const config = require('config')

// const winston = require('winston');
// const logger = winston.createLogger({
//     transports: [
//         new winston.transports.File({
//             level: 'info',
//             filename: `${config.get('transport')}.log`
//         }),
//         new winston.transports.Console()
//     ],
//     format: winston.format.combine(
//         winston.format.colorize({ all: true }),
//         winston.format.simple()
//     )
// });
const logger = require('./logger.js');

const express = require('express');
const app = express();
const fs = require('fs');
const Busboy = require('busboy');
const server = () => {
    const fileManager = require('./controllers/fileManager.js');
    app.get('/heartbeat', (req, res) => {
        logger.info('In heartbeat');
        res.status(200).send();
    })

    app.post('/uaffnas', async (req, res) => {
        logger.info('In file upload');
        // const response = await FileManager.uploadFile(req);
        // logger.info(req)
        var busboy = new Busboy({ headers: req.headers });
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            logger.info('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

						const mimetypeArr = mimetype.split('/');
						if (!fs.existsSync(`./files/${mimetypeArr[0]}`)) {
								fs.mkdirSync(`./files/${mimetypeArr[0]}`);
						}
						if (!fs.existsSync(`./files/${mimetypeArr[0]}/${mimetypeArr[1]}`)) {
								fs.mkdirSync(`./files/${mimetypeArr[0]}/${mimetypeArr[1]}`);
						}
            file.on('data', function (data) {
                logger.info('File [' + fieldname + '] got ' + data.length + ' bytes');
                logger.info(data)
                const buffer = Buffer.from(JSON.stringify(data));

								logger.info(`mimetype: ${mimetype}`);
                fs.writeFile(`./files/${mimetype}/${filename}`, data, file, (err) => {
                    if (err) {
                        logger.error('Error writing file - ' + err);
                    }
                    else {
                        fileManager.insertFile(filename);
                        logger.info('File written');
                    }
                });
            });
            file.on('end', function () {
                logger.info('File [' + fieldname + '] Finished');
            });
        });
        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            logger.info('Field [' + fieldname + ']: value: ' + inspect(val));
        });
				busboy.on('finish', function () {
            logger.info('Done parsing form!');
            // res.writeHead(303, { Connection: 'close', Location: '/' });
            res.end();
        });
        req.pipe(busboy);
        res.status(200).send()
    });
		app.get('/gaffnas', async (req,res) => {
			logger.info('In get file');
			// res.sendFile();
		});
    app.listen(config.port)
    logger.info(`Listening on: ${config.port}`);
}
const init = () => {
    server();
}
init();
