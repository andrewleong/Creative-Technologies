// (function() {
//     //videos variables
    

//     //var baseUrl = document.location.protocol + "//" + document.location.host
//     //var baseUrl = document.location.protocol + "//" + "10.167.118.37:3000"
//     var baseUrl = "https://creative-technologies-3000.herokuapp.com" 
    
//     var allChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
//     var ranLength = 50;
    
//     var uniqueId = "";

//     console.log("heheheh testing");
    
//     for(var i=0; i<ranLength; i++) {
//         uniqueId += allChars[Math.floor(Math.random() * allChars.length)];
//     }
    
//     $(document).ready(function() {
//         //var videoUrl1 = $('#video1').prop('src');

//         $("#qr").qrcode(baseUrl + "/mobile/" + uniqueId);  
//         console.log(baseUrl + "/mobile/" + uniqueId);
        
//         var socket = io.connect();

//         socket.emit('desktop-register', {id: uniqueId});

//         socket.on('mobile-on', function(data) {
//             $("#content").slideDown(function() { $(window).trigger('content-ready'); });
               
//                //player.playVideo(); 
               
//         });

//         //  socket.on('replace first video', function(data) {
//         //     player.loadVideoById("t8zgAag5jn4", 0, "default");
//         // });

//         //Orientation Change in PC browser trigger for game
//         socket.on('orientation', function(orientation) {
//             $(window).trigger('orientation-change', orientation);
//         })

//     });
// })();


(function() {

    var baseUrl = document.location.protocol + "//" + document.location.host
    //var baseUrl = "https://creative-technologies-3000.herokuapp.com" 
    
    var allChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var ranLength = 50;
    
    var uniqueId = "";

    //console.log("heheheh testing");
    
    for(var i=0; i<ranLength; i++) {
        uniqueId += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    $(document).ready(function() {

        $("#qr").qrcode(baseUrl + "/mobile/" + uniqueId);  
        console.log(baseUrl + "/mobile/" + uniqueId);
        
        var socket = io.connect();

        socket.emit('desktop-register', {id: uniqueId});

        //Server says create mobile-on function when user is regiestered.
        //Triggers the Game Content in mobile-on function
        socket.on('mobile-on', function(data) {
            $("#content").slideDown(function() { $(window).trigger('content-ready'); });       
        });

        //Mobile told server to trigger this Orientation Change in PC browser to trigger for game
        socket.on('orientation', function(orientation) {
            $(window).trigger('orientation-change', orientation);
        })

        // socket.on('receiver', function(data) {
        //     console.log(data);      
        // });
        
        
var myStateX = {};
var myStateY = {};
var xMe;
var yMe;

    socket.on('lol', function(newMobileX, newMobileY) {
            //var newDeskX = data.deskX;
            //var newDeskY = data.deskY;      
      
      myStateX = newMobileX;
      myStateY = newMobileY;
    // return yMe;
    //something();
     
      myFunction(myStateX, myStateY);
    //airplane.updatePlane(xTarget, yTarget);
            
            //console.log(mobileX);
            //console.log(newDeskY);
            
  });


 


//COLORS
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
};

// THREEJS RELATED Scene VARIABLES
var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, renderer, container;

//SCREEN & MOUSE VARIABLES
var HEIGHT, WIDTH, windowHalfX, windowHalfY;

//var mousePos = {x:0,y:0}
var mousePos = {x:0,y:0};


//INIT THREE JS, SCREEN AND MOUSE EVENTS

function createScene() {
  
  scene = new THREE.Scene();  
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );
  scene.fog = new THREE.Fog(0xf7d9aa, 100,950);
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);
  
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  window.addEventListener('resize', handleWindowResize, false);
}

// HANDLE SCREEN EVENTS
function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

//HANDLE ALL MOUSE/TOUCH STUFF
// function handleMouseMove(event) {
//   mousePos = {x:event.clientX, y:event.clientY};
// }

// function handleTouchStart(event) {
//   if (event.touches.length > 1) {
//     event.preventDefault();
//     mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
//   }
// }

// function handleTouchEnd(event) {
//     mousePos = {x:windowHalfX, y:windowHalfY};
// }

// function handleTouchMove(event) {
//   if (event.touches.length == 1) {
//     event.preventDefault();
//     mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
//   }
// }

// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

function createLights() {

  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
}

// 3D Models Airplane
var airplane;

function createPlane(){
  airplane = new AirPlane();
  airplane.mesh.scale.set(.25,.25,.25);
  airplane.mesh.position.y = 100;
  scene.add(airplane.mesh);
}

var AirPlane = function(){
  this.mesh = new THREE.Object3D();
    this.mesh.name = "AirPlane";
  
  // Create the cabin
  var geomCockpit = new THREE.BoxGeometry(60,50,50,1,1,1);
    var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
  cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.mesh.add(cockpit);

  // Create Tailplane
  var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
  var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
  tailPlane.position.set(-35,25,0);
  tailPlane.castShadow = true;
  tailPlane.receiveShadow = true;
  this.mesh.add(tailPlane);

};


 
 

    // var something = function(){
    //     // var xTarget = (val1-windowHalfX);
    //     // var yTarget = (val2-windowHalfY);
    //      window.LOL1 = ME1;
    //      window.LOL2 = ME2;
    //      //console.log(xTarget); 
    //   };  
//$(window).bind('something', init);


AirPlane.prototype.updatePlane = function(xTarget, yTarget){
  
  this.tPosY = normalize(yTarget, -.5,.25, 175, 25);
  this.tPosX = normalize(xTarget, -.5,.5,-100, 100);
  this.mesh.position.y += (this.tPosY - this.mesh.position.y) /20;
  this.mesh.position.x += (this.tPosX - this.mesh.position.x) /20;

  //var touchTargetY = normalize(touchPos.y,-.75,.75,25, 175);
  //var touchTargetX = normalize(touchPos.x,-.75,.75,-100, 100);
}

function myFunction(myStateX, myStateY){
      
      
      var xTarget = (myStateX-windowHalfX);
      var yTarget = (myStateY-windowHalfY);
     
      airplane.updatePlane(xTarget, yTarget);
  
    renderer.render(scene, camera);
   requestAnimationFrame(loop);
    
        //console.log("MyStateX" + myStateX);
     
 }


function loop(){
// update the plane on each frame
   // var xTarget = val1;
   // var yTarget = val2;
    //var xTarget = newDeskX;
    //var yTarget = newDeskY; 

    
  //     var xTarget = (mousePos.x-windowHalfX);
  //     var yTarget = (mousePos.y-windowHalfY);
     

  //       console.log("MyStateX" + myStateX);
  //    airplane.updatePlane(xTarget, yTarget);
    
   

  // renderer.render(scene, camera);
  // requestAnimationFrame(loop);
}




function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

function init(event){

  //$(window).bind('myGame', newCoordinates);

  createScene();
  createLights();
  createPlane();
  
  // document.addEventListener('mousemove', handleMouseMove, false);
  // document.addEventListener('touchstart', handleTouchStart, false);
  // document.addEventListener('touchend', handleTouchEnd, false);
  // document.addEventListener('touchmove',handleTouchMove, false);
  
  loop();
  
}

// var newCoordinates = function(data) {
//     //var something1 = data.newDeskX;
//     //var something2 = data.newDeskY;

//    console.log("testing" + data.newDeskX);
//    // console.log("testing" + something2); 

//  };


window.addEventListener('load', init, false);

//$(window).bind('content-ready', init);
            
            //console.log(newDeskY);
            //$(window).trigger('myGame', {newDeskX, newDeskY});

            //console.log(newDeskX );
            //console.log("New X" + newDeskX);
            //console.log("New Y" + newDeskY);      
        
    
  

    });
})();