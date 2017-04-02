//== Using Express in Node JS ==//
var express = require('express'), app = express(), server = require('http').createServer(app), io = require('socket.io').listen(server);

//== ==//
//== Setting the Views and Static files ==//
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/static'));

//== Setting up the Express routing ==//
app.get('/', function(req, res){
    res.render('index.jade');
});
app.get('/mobile/:id', function(req, res){
    res.render('mobile.jade', {id: req.params.id});
});

//== Server will listen to Port 3000, default port for Express ==//
server.listen(process.env.PORT || 3000);
console.log("Hello I am Listening to port " + 3000);

//== Storing registered users as Object ==//
var regUsers = {};

//==These sockets have to be global to establish the two way communication ==//
//== Global variales for desktp and mobile sockets ==//
var deskSocket;
var mobileSocket;

//== making the main connection on socket io ==//
io.sockets.on('connection', function(socket) {
    
    //== Socket listens to the request to receive unique id from desktop socket ==//
    socket.on('desktop-register', function(data) {
        //== Allocating the desktop's socket with registered users' unique id ==//
        regUsers[data.id] = deskSocket = socket;
        console.log("Desktop connected");
    });

    //== Socket listens to request receiving the unique id from mobile socket ==//
    socket.on('mobile-register', function(data) {
        //== Connect the Desktop's socket with Mobile's Socket ==//
        mobileSocket = socket;

        //== If registered users's id is not undefined then the desktop socket will connect to the mobile socket ==//
        if(typeof(regUsers[data.id]) !== "undefined") {
            deskSocket = regUsers[data.id];
            console.log("Mobile connected");
            
            //== DesktopSocket send to desktop first function, same with mobile ==//
            deskSocket.emit('deskShowInstructions');
            mobileSocket.emit('mobileShowInstructions');
        }
    });
    
    //== When user successfully collected points ==//
    socket.on('goSocialMedia', function(data) {
          
        if(typeof(mobileSocket) !== "undefined") {

           //== Mobile Socket sends function social media to mobile ==// 
           mobileSocket.emit('SocialMediaMobile');
        }
    });

    //== THIS IS WHEN THE GAME STARTS ==//
    socket.on('GameStart', function(data) {

        //== If desktop socket is not undefined then do ==// 
        if(typeof(deskSocket) !== "undefined" && deskSocket !== null) {
            deskSocket.emit('DeskGameStart');
            mobileSocket.emit('MobileGameStart');  
        }
    }.bind(this));

   //== Updates the position of the ice cream ==// 
   socket.on('updatePosition', function(data){

        //== create variable newMobile for the data received from mobile ==//
        var newMobileX = data.mobileX;
        var newMobileY = data.mobileY;

        //== Then send to the desktop to update the ice cream's new position ==//
        deskSocket.emit('newPosition', newMobileX, newMobileY);
    }.bind(this));


});