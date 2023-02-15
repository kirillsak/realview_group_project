/**********************************************
* UPLOAD.JS: Uploads a file to uploads folder *
***********************************************/
const dotenv = require("dotenv").config();
const express = require("express");
const mongodb = require("mongodb");
const multer = require("multer");
const fs = require("fs")
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const { s3Uploadv2, s3GetBucketContents, s3GetFile, s3GetFileLink } = require("./s3service");
const ERROR_FILE_TYPE = "Only glb files are allowed.";
const MAX_SIZE = 1024 * 1024 * 10; // MAX SIZE OF 100MB

const router = express.Router();

// Uploading to local disk to a destination and with a given filename
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, '../client/public/models/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, 'item.glb');
//     }
// });

//Creating storage for S3
const storage = multer.memoryStorage();

// // Uploaded file validation using multer, incl. logic for local storage, file size, and file type
const upload = multer({
    storage,//: storage,
    limits: {
        fileSize: MAX_SIZE
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.endsWith('.glb')) {
            const error = new Error("Wrong file type");
            error.code = "ERROR_FILE_TYPE";
            return cb(error, false);
        }
        cb(null, true);
    }
});

//Write file to local directory - Doesnt work yet
// const writeFileToLocalDirectory = (fileData, filePath) => {
//     fs.writeFile(filePath, fileData, (error) => {
//         if(error){
//             console.error(error);
//         }else{
//             console.log(`File saved to ${filePath}`);
//         }
//     });
// };

//Multer S3
// const s3 = new aws.S3();
// const upload = multer({
//     storage: multerS3({
//         bucket: process.env.AWS_BUCKET_NAME,
//         s3: s3,
//         // acl:"public-read",
//         key: (req, file, cb) => {
//             cb(null, `models/item.glb`);
//         }
//     }),
//     limits: {
//         fileSize: MAX_SIZE
//     },
//     fileFilter: (req, file, cb) => {
//         if (!file.originalname.endsWith('.glb')) {
//             const error = new Error("Wrong file type");
//             error.code = "ERROR_FILE_TYPE";
//             return cb(error, false);
//         }
//         cb(null, true);
//     }
// });

// //Single Upload to S3
// router.post('/', upload.single('file'), async (req, res) => {
//     try{
//         const file = req.file;
//         console.log(file);
//         res.status(200).json({
//             success: true,
//             message: "File uploaded successfully",
//             data: {
//                 file
//             }
//         });

//     }catch(error){
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "File upload failed",
//             error: error.message
//         })
//     }
//     //console.log(req.file);
//     //res.send(`Successfully uploaded ${req.file.originalname} to ${req.file.location}`);
//     //res.send(`Successfully uploaded ${req.file.originalname} to ${result.Location }`)
// });

//Single Upload to S3 - Old
router.post('/', upload.single('file'), async (req, res) => {
    const result = await s3Uploadv2(req.file);
    res.json({ file: req.file, result });
});

//Get all list of all files from S3
router.get('/', async (req, res) => {
    const bucketData = await s3GetBucketContents();
    res.json({bucketData});
});

//Get item.glb from S3 to local directory
router.get('/local/item', async (req, res) => {
    const fileData = await s3GetFile();
    res.json({fileData});
    // const filePath = '../client/public/models/';
    // writeFileToLocalDirectory(fileData, filePath);
});

//Get item.glb Link from S3
router.get('/:id', async (req, res) => {
    const fileLink = await s3GetFileLink(req.params.id);
    res.json({fileLink});
    // const filePath = '../client/public/models/';
    // writeFileToLocalDirectory(fileData, filePath);
});

//Get Uploaded file - doesnt work 
// router.get('/', async (req, res) => {
//     const result = await s3GetFile();
//     res.json({ result });
// });

//Error Handling (Must Come After POST Request)
router.use(function (err, req, res, next) {
    if (err.code === "ERROR_FILE_TYPE") {
        res.status(422).json({ error: "Only .glb files are allowed!" });
        return;
    }
    if (err.code === "LIMIT_FILE_SIZE") {
        res.status(422).json({ error: "Too large file." });
        return;
    }
});

module.exports = router;
