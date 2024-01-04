const express = require('express');

const Authorization = require('../middleware/authentication');

const messageController = require('../controllers/message');

const multer = require('multer');
const upload = multer();

const router = express.Router();

module.exports = (io) => {
    router.post('/postmessage', Authorization.authenticate, (req, res) =>
        messageController.postMessage(io, req, res)
    );
    router.post('/postmedia/:groupId', Authorization.authenticate, upload.single('file'),(req, res) =>
        messageController.sendMultiMedia(io, req, res)
    );
    router.get('/getmessages', Authorization.authenticate, messageController.getMessages);

    return router;
};