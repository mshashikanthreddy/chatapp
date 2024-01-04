const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const MessageArchieved = sequelize.define("messages_archieved",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      groupId:{
        type: Sequelize.INTEGER,
      },
      userId:{
        type: Sequelize.INTEGER,
      }
     
});

module.exports = MessageArchieved;