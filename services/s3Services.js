const AWS = require('aws-sdk');
require('dotenv').config(); // Don't forget to call the function

const BUCKET_NAME = 'groupchatapp-1';

const uploadToS3 = (data, filename) => {
    let s3bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
    });

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read',
    };

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('Something Went wrong', err);
                reject(err); // Reject with the actual error
            } else {
                console.log('Success', s3response);
                resolve(s3response.Location); // Resolve with the S3 URL (s3response.Location)
            }
        });
    });
};

module.exports = {
    uploadToS3,
};