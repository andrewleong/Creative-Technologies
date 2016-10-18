var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

var myTimer;
var time;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'GgyPCtKudrE',
        
         events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
         }
    });
}

// var playerReady = false;
//     // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
         console.log('player is ready');
     }


        
function onPlayerStateChange(event){
    if(event.data==1) { // playing
        myTimer = setInterval(function(){ 
            
            time = player.getCurrentTime();
            //stopVid();
            console.log(time);
        }, 100); // 100 means repeat in 100 ms
    }
    else { // not playing
        clearInterval(myTimer);
    }
    // function stopVid(){
    //     if(time >= 5){
    //         player.pauseVideo();
    //     }
    // }
}
      

  