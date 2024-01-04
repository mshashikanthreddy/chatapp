const Message = require('../models/messages');
const MessageArchieved = require('../models/messagesArchieved');
const User = require('../models/users');
const S3services = require('../services/s3Services');
const {Op} = require('sequelize');
const CronJob = require('cron').CronJob;

postMessage = async (io, req, res, next) => {
    const message = req.body.message;
    const groupId = req.body.groupId;

    try {

       const response = await req.user.createMessage({
            message: message,
            groupId: groupId,
            userId: req.user.id,
        });
        // console.log("Response", req.user.name);
        const toServer = {
            message,
         user: {name: req.user.name}
        }
        io.emit('new-message', toServer);
        res.status(201).json({ message: response });

    }
     catch(err) {
        console.log(err);
    }
}

sendMultiMedia = async (io,req, res, next) => {
    try {
      const groupId = req.params.groupId;
        const media = req.file.buffer;
        console.log(media);
      const userId = req.user.id;
      const filename = `Media${userId}/${new Date()}`;
  
      const fileURL = await S3services.uploadToS3(media, filename);
        
    const response = await req.user.createMessage(
      {
          message: fileURL,
          groupId: groupId,
          userId: userId,
      }
      
  );
    const toServer = {
    message: fileURL,
    user: {name: req.user.name}
    }
      io.emit('new-message', toServer);
      res.status(200).json({ fileURL: fileURL, success: true, response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to upload multimedia to S3.', success: false});
    }
  };

getMessages = async (req, res, next) => {


    try {

   const lastMsgId = req.query.id || 0;
   const groupId = req.query.groupid;

   const messages = await  Message.findAll({
    where :{ id: { [Op.gt] : lastMsgId}, 
             groupId: groupId   },
    include: [{ model: User, attributes: ['name'] }],
   });

   res.json(messages)

    }
     catch(err) {
        console.log(err);
    }
}

const job = new CronJob(
    '0 12 * * *', 
    async function() {
        try {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); 
            console.log("One Day Ago", oneDayAgo);
            const oldMessages = await Message.findAll({
                where: {
                    createdAt: { [Op.lt]: oneDayAgo },
                },
            });
          
            for (const oldMessage of oldMessages) {
                await MessageArchieved.create({
                    
                    message: oldMessage.message,
                    groupId: oldMessage.groupId,
                    userId: oldMessage.userId,
                    createdAt: oldMessage.createdAt,
                    updatedAt: oldMessage.updatedAt,
                });

                await oldMessage.destroy(); 
            }

            console.log('Archived and deleted old messages.');
        } catch (error) {
            console.error('Error archiving and deleting old messages:', error);
        }
    },
    null,
    true,
    'America/Los_Angeles'
)

module.exports = {

    postMessage,
    getMessages,
    sendMultiMedia
}