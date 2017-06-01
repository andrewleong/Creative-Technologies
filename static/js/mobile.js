//==REFERENCES & SOURCES USED==//

//--Wegner, J. (2013). An Experiment In Mobile Controllers [blog]. Available from: http://wegnerdesign.com/blog/an-experiment-in-mobile-controllers/[Accessed: 4 April 2017].--//

(function() {
      
     //== The main URL location.protocol is http: and location.host is the uri like localhost ==// 
     var baseUrl = document.location.protocol + "//" + document.location.host
    
    $(document).ready(function() {
        
        //== connect to mobile socket ==//
        var socket = io.connect();
        //var socket = io.connect('192.168.1.71:3000');

        //== embed the unique id to the body on mobile html dynamically ==//
        var uniqueId = $("body").attr('data-id');
        
        //== Mobile socket sends server saying register its id with the unique ID ==//
        socket.emit('mobile-register', {id: uniqueId});

        //== Received request from server, show instructions on phone ==//
        socket.on('mobileShowInstructions', function(data) {
            
              $(".button").on("click", function() {

              //== Tell the server to tell desktop to Start the game ==//
              socket.emit('GameStart', data);
              
              });              
        });

        //== Received request from server, remove instructions and trigger start game ==//
        socket.on('MobileGameStart', function(data) {
            $("#Mobile-Instruction").slideUp(function() { 
              $(window).trigger('init'); 
              console.log("Let the Games Begin");
            });           
        });

        //== Receiving from server, open social media for reward ==//
        socket.on('SocialMediaMobile', function(data) {
              $("#Reward-Page").css("z-index","30000");
              $("#Reward-Page").css("overflow-y","visible");
              $("html").css("overflow-y","visible");
              $("body").css("overflow-y","visible");
              $("#Reward-Page").css("height","auto","important");
        });

        //== When user clicks FB Post button, go to facebook ==//
        $("#FB-Button").on('click',function(){
              $("#FB").css("z-index","300000");
              $("#FB").css("overflow-y","visible");
              console.log("facebook image");
        });

//== Emits user's finger position to server ==//
function setUpdatePosition(){
  socket.emit('updatePosition', {mobileX: mousePosMobile.x, mobileY: mousePosMobile.y} ); 
  //console.log("update position emitted");     
}

//==REFERENCES & SOURCES USED==//

//-- Maaloul, K. (2016).The Making of “The Aviator”: Animating a Basic 3D Scene with Three.js [online]. Available from: https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/[Accessed: 4 April 2017]. --//

//== ThreeJs color variable code == //
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
    yellow:0xffdc34,
};

//== THREEJS RELATED Scene VARIABLES ==//
var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, renderer, container;

//== SCREEN & MOUSE VARIABLES ==//
var HEIGHT, WIDTH, windowHalfX, windowHalfY, mousePosMobile = {x:0,y:0};

//== X and Y target point for mobile ==//
var xTargetMobile;
var yTargetMobile;

//== INIT THREE JS, SCREEN AND MOUSE EVENTS ==//
$(window).bind('load', function (e) {
  
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

  document.addEventListener('mousemove', handleMouseMove, false);
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchend', handleTouchEnd, false);
  document.addEventListener('touchmove',handleTouchMove, false);
}

//== HANDLE SCREEN EVENTS ==//
function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

//== HANDLE ALL MOUSE/TOUCH STUFF ==//
function handleMouseMove(event) {
  mousePosMobile = {x:event.clientX, y:event.clientY};
}

function handleTouchStart(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
        mousePosMobile = {x:event.touches[0].pageX, y:event.touches[0].pageY};
  }
}

function handleTouchEnd(event) {
    mousePosMobile = {x:windowHalfX, y:windowHalfY};
}

function handleTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
        mousePosMobile = {x:event.touches[0].pageX, y:event.touches[0].pageY};
  }
}

//== SET UP LIGHTS ==//
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

//== Variable JSONLOADER for custom model ==//
var loader = new THREE.JSONLoader();

//== Player character ==//
var ice;

//== Create the ice cream model ==//
function createIceCream(){
  
  loader.load("ice_cream.js", function(geometry, materials){
  var material = new THREE.MultiMaterial(materials);
   
  ice = new THREE.Mesh(geometry, material);
  ice.scale.set(15,15,15);  
  ice.position.y = 200;
  ice.rotation.z = 80.1;
  ice.castShadow = true;
  ice.receiveShadow = true;
  scene.add(ice);
  });
}

//== updating iceCream position function ==//
function updateIceCream (xTargetMobile, yTargetMobile){
    
if(ice !== undefined){
      
  ice.tPosY = normalize(yTargetMobile, -.5,.25, 175, 25);
  ice.tPosX = normalize(xTargetMobile, -1, 1,-100, 100);

  //== Move the player at each frame by adding a fraction of the remaining distance ==//
  ice.position.y += (ice.tPosY - ice.position.y) *0.1;
  ice.position.x += (ice.tPosX - ice.position.x) *0.1;
  
  }
}

//== updates on each frame ==//
function loop(){

    xTargetMobile = (mousePosMobile.x-windowHalfX);
    yTargetMobile= (mousePosMobile.y-windowHalfY);

    updateIceCream(xTargetMobile, yTargetMobile);
   
    setUpdatePosition();
    
    renderer.render(scene, camera);
    
    requestAnimationFrame(loop);
}

//== Set matrix for position normalization ==//
function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

//== Bind init function ==//
$(window).bind('init', function (e) {
  
  createScene();
  createLights();
  createIceCream();

  loop();

  //== Triggers load function above ==//
  $(window).trigger('load');
  console.log("scene created");

  });

}); //== end of load function ==//
        
}); //End of $(document).ready(function()

})();