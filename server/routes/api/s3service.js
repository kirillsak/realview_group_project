const { S3 } = require('aws-sdk');
const multer = require('multer');

exports.s3Uploadv2 = async(file) => {
    const s3 = new S3();

    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `models/item.glb`,
        Body: file.buffer
    };
    return await s3.upload(param).promise();
};

//Try to Get Files from S3 - Doesnt work
// exports.s3GetFile = async() => {
//     const s3 = new S3();

//     const param = {
//         Bucket: process.env.AWS_BUCKET_NAME
//     };

//     s3.config.setPromisesDependency();
//     s3.config.update(param);
//     // return await s3.listObjectsV2({
//     //     Bucket: process.env.AWS_BUCKET_NAME
//     // }).promise();

//     const response = await s3.listObjectsV2({
//         Bucket: process.env.AWS_BUCKET_NAME
//     }).promise();

//     return response;
    
// };