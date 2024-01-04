const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const path = require('path');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const multer = require('multer');
dotenv.config();

const app = express();

const User = require('./models/users');
const Message = require('./models/messages');
const Group = require('./models/groups');
const GroupUser = require('./models/groupUsers');

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const groupRoutes = require('./routes/group');


const port = process.env.PORT;

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});

const io = socketIo(server);

app.use(bodyparser.json({ extended: false }));
app.use(cors({
    methods:["GET","POST"],
    // credentials: true,
}));

const sequelize = require('./util/database');

app.use('/user', userRoutes);
app.use('/message', messageRoutes(io));
app.use('/group', groupRoutes);


User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(Group);
Group.belongsToMany(User, { through: GroupUser });

GroupUser.belongsTo(Group);

Group.hasMany(Message);
Message.belongsTo(Group);


app.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, `views/${req.url}`));
});

sequelize.sync()
    //sequelize.sync({force: true})
    .then((result) => {
        console.log("Connected to database!!!");
    }).catch((err) => {
        console.log(err);
    });

app.use((req, res, next) => {
    res.status(404).send("<h1>Page Not Found</h1>");
});