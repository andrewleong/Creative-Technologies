(function() {
    //videos variables
    

    //var baseUrl = document.location.protocol + "//" + document.location.host
    //var baseUrl = document.location.protocol + "//" + "10.167.118.37:3000"
    var baseUrl = "https://creative-technologies-3000.herokuapp.com" 
    
    var allChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var ranLength = 50;
    
    var uniqueId = "";

    console.log("heheheh testing");
    
    for(var i=0; i<ranLength; i++) {
        uniqueId += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    $(document).ready(function() {
        var videoUrl1 = $('#video1').prop('src');

        $("#qr").qrcode(baseUrl + "/mobile/" + uniqueId);  
        console.log(baseUrl + "/mobile/" + uniqueId);
        
        var socket = io.connect();

        socket.emit('desktop-register', {id: uniqueId});

        socket.on('mobile-on', function(data) {
            $("#content").slideDown(function() { $(window).trigger('content-ready'); });
               player.playVideo(); 
               
        });

         socket.on('replace first video', function(data) {
            player.loadVideoById("t8zgAag5jn4", 0, "default");
        });

        //Orientation Change in PC browser trigger for game
        socket.on('orientation', function(orientation) {
            $(window).trigger('orientation-change', orientation);
        })

    });
})();