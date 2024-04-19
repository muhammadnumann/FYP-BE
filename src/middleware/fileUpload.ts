import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }                       
  })
                  
export const upload = multer({ storage: storage })



// const storage = multer.diskStorage({  destination: function(req, file, cb) {
//     cb(null, 'uploads/'); // Specify the upload directory
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.originalname); // Use the original file name
//   }
// });
// export const upload = multer({ storage: storage });



// const service = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'uploads/section'); // Specify the upload directory
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.originalname); // Use the original file name
//   }
// });
// export const serviceUpload = multer({ storage: service });
