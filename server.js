var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

//IT WORKS

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
    res.render('index.jade');
});
app.get('/mobile/:id', function(req, res){
    res.render('mobile.jade', {id: req.params.id});
});

server.listen(process.env.PORT || 3000, "0.0.0.0");

console.log("Listening to " + 3000);
console.log("Hello!");

var regUsers = {};

io.sockets.on('connection', function(socket) {
    var deskSocket;
    var mobileSocket

    socket.on('desktop-register', function(data) {
        regUsers[data.id] = deskSocket = socket;
        console.log("Desktop connected");
    });

    
    socket.on('mobile-register', function(data) {
        mobileSocket = socket;

        if(typeof(regUsers[data.id]) !== "undefined") {
            deskSocket = regUsers[data.id];
            console.log("Mobile connected");
            deskSocket.emit('mobile-on');
            mobileSocket.emit('start');
        }
    });

    /*THIS IS MOBILE ORIENTATION */
    socket.on('mobile-orientation', function(orientation) {
        if(typeof(deskSocket) !== "undefined" && deskSocket !== null) {
            deskSocket.emit('orientation', orientation);
        }
    });

    /* THIS IS VIDEO*/
    // socket.on('change first video', function(data) {
        
    //         deskSocket.emit('replace first video');
        
    // });
});