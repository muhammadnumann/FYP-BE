/* eslint-disable import/first */
import dotenv from 'dotenv';
import path from "path"
import fs from "fs"

const result = dotenv.config();
if (result.error) {
    dotenv.config({ path: '.env.default' });
}
import util from 'util';
import app from './app';
import SafeMongooseConnection from './lib/safe-mongoose-connection';
import logger from './logger';
import mongoose from 'mongoose';
import { addAdminCredentials } from './helpers/addDefaultuser';
mongoose.set('useFindAndModify', false);
const PORT = process.env.PORT || 3000;

let debugCallback = null;
if (process.env.NODE_ENV === 'development') {
    debugCallback = (collectionName: string, method: string, query: any, doc: string): void => {
        const message = `${collectionName}.${method}(${util.inspect(query, { colors: true, depth: null })})`;
        logger.log({
            level: 'verbose',
            message,
            consoleLoggerOptions: { label: 'MONGO' }
        });
    };
}

const safeMongooseConnection = new SafeMongooseConnection({
    mongoUrl: process.env.MONGO_URL || '',
    onStartConnection: mongoUrl => logger.info(`Connecting to MongoDB at ${mongoUrl}`),
    onConnectionError: (error, mongoUrl) => logger.log({
        level: 'error',
        message: `Could not connect to MongoDB at ${mongoUrl}`,
        error
    }),
    onConnectionRetry: mongoUrl => logger.info(`Retrying to MongoDB at ${mongoUrl}`)
});

app.get('/files/:filename', (req, res) => {
    const filename = req.params.filename;
    console.log(filename)
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    console.log(filePath)
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).send('File not found');
            return;
        }

        // Serve the file
        res.sendFile(filePath);
    });
});



const serve = () => app.listen(PORT, () => {
    logger.info(`🌏 Express server started at http://localhost:${PORT}`);

    addAdminCredentials()
    if (process.env.NODE_ENV === 'development') {
        // This route is only present in development mode
        logger.info(`⚙️  Swagger UI hosted at http://localhost:${PORT}/dev/api-docs`);
    }
});

if (process.env.MONGO_URL == null) {
    logger.error('MONGO_URL not specified in environment');
    process.exit(1);
} else {
    safeMongooseConnection.connect(mongoUrl => {
        logger.info(`Connected to MongoDB at ${mongoUrl}`);
        serve();
    });
}

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', () => {
    console.log('\n'); /* eslint-disable-line */
    logger.info('Gracefully shutting down');
    logger.info('Closing the MongoDB connection');
    safeMongooseConnection.close(err => {
        if (err) {
            logger.log({
                level: 'error',
                message: 'Error shutting closing mongo connection',
                error: err
            });
        } else {
            logger.info('Mongo connection closed successfully');
        }
        process.exit(0);
    }, true);
});
