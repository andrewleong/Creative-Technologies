// (function() {
// 	$(document).ready(function() {

// 		var balls = [];
// 		var ballMass = 10;
// 		var curRotation = 0;
// 		var len = $("#bar").width();
// 		var accelModifier = .005;
//         var friction = .005;
//         var run = false

// 		var init = function(e) {
// 			$(window).bind('orientation-change', orientationHandler);

// 			$(".ball").each(function() {
// 				balls.push({
// 					ele: this,
// 					velocity: 0
// 				});
// 			});

// 		};

// 		var orientationHandler = function(e, orientation) {
// 			$("#field").css({
// 				"-webkit-transform": "rotate(" + orientation.beta + "deg)"
// 			});

// 			curRotation = orientation.beta;
            
//             if(!run) {
//                 run = setInterval(runFrame, 50);
//             }
// 		};

// 		var runFrame = function() {
//             //Convert to radians, by the way
// 			var theta = (180 - (90 + Math.abs(curRotation)) * Math.PI) / 180;

// 			var force = len * Math.cos(theta) * 9.8;

// 			var accel = (force / ballMass) * accelModifier;

// 			//Reapply the direction portion of the velocity, because we stripped it out with Math.abs
// 			accel = curRotation >= 0 ? accel : accel * -1;
//             console.log("rotation of " + curRotation + " resulted in acceleration of " + accel);
// 			for(var i=0,max=balls.length; i<max; i++) {
//                 //console.log("Acceleration of " + accel + " will change " + balls[i].velocity + " to " + (balls[i].velocity + accel));
// 				balls[i].velocity += accel;
                
//                 if(Math.abs(balls[i].velocity) <= friction) {
//                     balls[i].velocity = 0;
//                 } else {
//                     balls[i].velocity = balls[i].velocity >= 0 ? balls[i].velocity - friction : balls[i].velocity + friction;
//                 }
                
// 				$(balls[i].ele).css('left', '+='+balls[i].velocity);
// 			}
// 		}

// 		$(window).bind('content-ready', init);

// 	});
// })();

(function() {
	$(document).ready(function() {

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
var HEIGHT, WIDTH, windowHalfX, windowHalfY, mousePos = {x:0,y:0};

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
function handleMouseMove(event) {
  mousePos = {x:event.clientX, y:event.clientY};
}

function handleTouchStart(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
    mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
  }
}

function handleTouchEnd(event) {
    mousePos = {x:windowHalfX, y:windowHalfY};
}

function handleTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
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

AirPlane.prototype.updatePlane = function(xTarget, yTarget){

  
  this.tPosY = normalize(yTarget, -.5,.25, 175, 25);
  this.tPosX = normalize(xTarget, -.5,.5,-100, 100);
  this.mesh.position.y += (this.tPosY - this.mesh.position.y) /20;
  this.mesh.position.x += (this.tPosX - this.mesh.position.x) /20;
 
}

function loop(){
// update the plane on each frame
  var xTarget = (mousePos.x-windowHalfX);
    var yTarget= (mousePos.y-windowHalfY);
  
  //updatePlane();
    airplane.updatePlane(xTarget, yTarget);
   
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
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
  createScene();
  createLights();
  createPlane();
  
  document.addEventListener('mousemove', handleMouseMove, false);
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchend', handleTouchEnd, false);
  document.addEventListener('touchmove',handleTouchMove, false);
  
  loop();
}


window.addEventListener('load', init, false);


		// var balls = [];
		// var ballMass = 10;
		//var curRotation = 0;
		// var len = $("#bar").width();
		// var accelModifier = .005;
  //       var friction = .005;
  //       var run = false
  var ball   = document.querySelector('.ball');
  var garden = document.querySelector('.garden');
  var output = document.querySelector('.output');

 

		var init = function(e) {
			$(window).bind('orientation-change', orientationHandler);

			 //console.log(garden);

		};

		var orientationHandler = function(e, orientation) {
      
		var maxX = garden.clientWidth  - ball.clientWidth;
 		var maxY = garden.clientHeight - ball.clientHeight;
			console.log(orientation);
			 var x = orientation.beta;  // In degree in the range [-180,180]
  			 var y = orientation.gamma; // In degree in the range [-90,90]

  			output.innerHTML  = "beta : " + x + "\n";
  			output.innerHTML += "gamma: " + y + "\n";

  // Because we don't want to have the device upside down
  // We constrain the x value to the range [-90,90]
  if (x >  90) { x =  90};
  if (x < -90) { x = -90};

  // To make computation easier we shift the range of 
  // x and y to [0,180]
  x += 90;
  y += 90;

  // 10 is half the size of the ball
  // It center the positioning point to the center of the ball
  ball.style.top  = (maxX*x/180 - 10) + "px";
  ball.style.left = (maxY*y/180 - 10) + "px";
  
  console.log("Beta" + orientation.beta);
  console.log("MaxX" + maxX);
		};

		//content-ready function is triggered from main js mobile-on function
		$(window).bind('content-ready', init);

	});
})();