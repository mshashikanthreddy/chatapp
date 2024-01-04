const express = require('express');
const Authorization = require('../middleware/authentication');


const groupController = require('../controllers/group');

const router = express.Router();

router.post('/creategroup', Authorization.authenticate, groupController.postGroup);
router.post('/addUser', Authorization.authenticate, groupController.addGroupUser);
router.post('/removeUser', Authorization.authenticate, groupController.removeGroupUser);
router.get('/getgroups', Authorization.authenticate, groupController.getGroups);

module.exports = router;