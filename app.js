var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var port = process.env.PORT || 4000;
var server = app.listen(port, function(){
    console.log('listening for requests on port 4000,');
});

// Static files
app.use(express.static('public'));

// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    socket.on('chat', function(data){
        console.log(data);
        io.sockets.emit('chat', data);
    });

    // socket.on('disconnect', function() {
    //     alert('app.js disconnect');
    //     console.log('app.js disconnected');
    //     io.sockets.emit('chat', 'disconnect');
    // });
});
