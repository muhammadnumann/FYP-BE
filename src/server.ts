/* eslint-disable import/first */
import dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
    dotenv.config({ path: '.env.default' });
}
import util from 'util';
import app from './app';
import SafeMongooseConnection from './lib/safe-mongoose-connection';
import logger from './logger';
import mongoose from 'mongoose';
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

const serve = () => app.listen(PORT, () => {
    logger.info(`🌏 Express server started at http://localhost:${PORT}`);

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



// const mongoose = require('mongoose');
// const multer = require('multer');
// const path = require('path');
// app.use(express.json());
// const { Schema } = mongoose;
// const sectionSchema = new Schema({
//   name: String,
//   image: String
// });

// const myModelSchema = new Schema({
//   name: String,
//   image: String,
//   section: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Section'
//   }]
// });

// const Section = mongoose.model('Section', sectionSchema);

// const MyModel = mongoose.model('MyModel', myModelSchema);
                
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/sections')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })
// const service = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/service')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })
// const serviceUpload = multer({ 
//   storage: service, 
//   fileFilter: function (req, file, cb) {
//     if (file.fieldname === 'image') {
//       cb(null, true);
//     } else {
//       cb(new Error('Unexpected field'));
//     }
//   }
// })
// const upload = multer({ 
//   storage: storage, 
//   fileFilter: function (req, file, cb) {
//     if (file.fieldname === 'image') {
//       cb(null, true);
//     } else {
//       cb(new Error('Unexpected field'));
//     }
//   }
// })
// app.post('/add-section', upload.single('image'), (req, res) => {
//   const { name } = req.body;
//   const imagePath = path.join('upload', req.file.filename);
//   const section = new Section({ name, image: imagePath }); // use the filename provided by multer
//   section.save((err, savedSection) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       const sectionId = savedSection._id;

//       let myModelId = req.cookies.myModelId;

//       if (!myModelId) {
//         const myModel = new MyModel({
//           section: [sectionId]
//         });
//         myModel.save((err, savedMyModel) => {
//           if (err) {
//             res.status(500).send(err);
//           } else {
//             myModelId = savedMyModel._id.toString();
//             res.cookie('myModelId', myModelId);
//             res.send(savedMyModel);
//           }
//         });
//       } else {
//         MyModel.findById(myModelId, (err, myModel) => {
//           if (err) {
//             res.status(500).send(err);
//           } else {
//             myModel.section.push(sectionId);
//             myModel.save((err, savedMyModel) => {
//               if (err) {
//                 res.status(500).send(err);
//               } else {
//                 res.send(savedMyModel);
//               }
//             });
//           }
//         });
//       }
//     }
//   });
// });

// app.post('/service-add',serviceUpload.single('image'), (req, res) => {
//   const { name } = req.body;
//   const imagePath = path.join('upload', req.file.filename);
//   const myModelId = req.cookies.myModelId;
//   if (!myModelId) {
//     const myModel = new MyModel({
//       name: name,
//       image: imagePath
//     });
//     myModel.save((err, savedMyModel) => {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         res.send(savedMyModel);
//       }
//     })
//   }
//   else{
//     MyModel.findById(myModelId, (err, myModel) => {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         myModel.name = name;
//         myModel.image = imagePath;
//         myModel.save((err, savedMyModel) => {
//           if (err) {
//             res.status(500).send(err);
//           } else {
//             res.clearCookie('myModelId');
//             res.send(savedMyModel);
//           }
//         });
//       }
//     });
//   }
  
// });


// app.get('/services', async (req, res) => {
//   try {
//     const services = await MyModel.find();
//     const result = [];
//     for (let i = 0; i < services.length; i++) {
//       const service = services[i];
//       const sectionIds = service.section;
//       const sections = await Section.find({ _id: { $in: sectionIds } });
//       const serviceWithSections = { ...service._doc, sections };
//       delete serviceWithSections.section;
//       result.push(serviceWithSections);
//     }
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
