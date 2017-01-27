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

        

//COLORS
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
    yellow:0xffdc34
};

// THREEJS RELATED Scene VARIABLES
var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, renderer, container;

//SCREEN & MOUSE VARIABLES
var HEIGHT, WIDTH, windowHalfX, windowHalfY, mousePosMobile = {x:0,y:0};

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

    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);
    document.addEventListener('touchmove',handleTouchMove, false);
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


// //My Ice cream Cone OMGGGG SO SMALL
// var icecream;

// function createCone(){
//       icecream = new IceCream();
//       icecream.mesh.scale.set(.25,.25,.25);
//       icecream.mesh.position.y = 10;
//       icecream.mesh.position.z = 100;

//       icecream.mesh.rotation.z = Math.PI / -2;

//       scene.add(icecream.mesh);
//  }   

//  var IceCream = function(){
//     this.mesh = new THREE.Object3D();
//     this.mesh.name = "IceCream";

//     var conegeometry = new THREE.CylinderGeometry(10,.10,50,32,1, true);
//     var conematerial = new THREE.MeshPhongMaterial({color:Colors.pink, shading:THREE.FlatShading});
//     var cone = new THREE.Mesh(conegeometry, conematerial);
//     cone.castShadow = true;
//     cone.receiveShadow = true;
//     this.mesh.add(cone); 
// };        

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
    var matCockpit = new THREE.MeshPhongMaterial({color:Colors.yellow, shading:THREE.FlatShading});
    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.mesh.add(cockpit);

};


//updating plane function
AirPlane.prototype.updatePlane = function(xTargetMobile, yTargetMobile){
  
  this.tPosY = normalize(yTargetMobile, -.5,.25, 175, 25);
  this.tPosX = normalize(xTargetMobile, -.10, 70,-80, 80);
  this.mesh.position.y += (this.tPosY - this.mesh.position.y) /20;
  this.mesh.position.x += (this.tPosX - this.mesh.position.x) /20;
}

function loop(){
// update the plane on each frame
    var xTargetMobile = (mousePosMobile.x-windowHalfX);
    var yTargetMobile= (mousePosMobile.y-windowHalfY);

    airplane.updatePlane(xTargetMobile, yTargetMobile);
    
    //socket.emit('updatePosition', {mobileX: xTargetMobile, mobileY: yTargetMobile} );
    socket.emit('updatePosition', {mobileX: mousePosMobile.x, mobileY: mousePosMobile.y} );

    
  //updatePlane();
    //myPlaneUpdate();
    
    //console.log(xTargetMobile);
   
   //socket.emit('pushData', { hello: xTargetMobile});

    renderer.render(scene, camera);
    
    requestAnimationFrame(loop);
}

 //var myPlaneUpdate = function(){

    
 //}

function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

function init(event){
  createScene();
  createLights();
  createPlane();
  //createCone();
  loop();
}

window.addEventListener('load', init, false);


console.log("scene created");



// socket.on('goTouch', function(data) {
//      airplane.updatePlane(xTargetMobile, yTargetMobile);

//     });



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