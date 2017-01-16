(function() {
    
    var baseUrl = document.location.protocol + "//" + document.location.host
    
    $(document).ready(function() {
        //var socket = io.connect('10.167.119.52:8080');
        var socket = io.connect();
        var uniqueId = $("body").attr('data-id');
        console.log("document ready or connected");
       
        
        socket.emit('mobile-register', {id: uniqueId});

        $(".button").on("click", function() {
        //player.loadVideoById("Vw4KVoEVcr0", 0, "default");
        socket.emit('change first video');
        console.log("clicked");
    });

         socket.on('goTouch', function(xTargetMobile, yTargetMobile) {
            console.log(airplane.mesh.position.y);

    });

        socket.on('start', function(data) {
            MobileReader.bindOrientation({
            	callback: function(orientation) {
            		socket.emit('mobile-orientation', orientation);
                    $(".count").text(parseInt($(".count").text()) + 1);
            	},
            	interval: 100
            });
        });
    });
})();