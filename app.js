const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./models/user-model')

mongoose.connect('mongodb://omnify:omnify123@ds121203.mlab.com:21203/omnify', {
    useNewUrlParser: true
}, () => {
    console.log("Connected to db")
});

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

var path = require('path');
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {

    res.sendFile(__dirname + '/index.html');

});

app.post('/events', (req, res) => {
    var events = req.body['events[]'];
    var id = events.pop();
    User.findOne({
        googleID: id
    }).then((currentUser) => {
        if (currentUser) {
            console.log("User already exits:\n" + currentUser);
        } else {
            new User({
                googleID: id,
                events: events
            }).save().then((newUser) => {
                console.log("New User: \n" + newUser);
            });
        }
    });

})

app.listen(process.env.port || 3000, () => {
    console.log("Now listening on port 3000");
});