var express = require('express');
var path = require('path');

var port = process.env.PORT || 3200;

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var serverApplication = require('./app/server/app')({io});

serverApplication.init();


//SERVING STATIC FILES
app.use("/bower_components", express.static(path.join(__dirname + '/bower_components')));
app.use('/node_modules', express.static(path.join(__dirname + '/node_modules')));
app.use('/assets', express.static(path.join(__dirname + '/app/front-end/assets')));
app.use("/app", express.static(path.join(__dirname + '/app')));
app.use("/scripts", express.static(path.join(__dirname + '/app/front-end/scripts')));


app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/app/front-end/index.html'))
});

server.listen(port, function () {
	console.log('CHAT SERVER ONLINE ON...', port);
});

