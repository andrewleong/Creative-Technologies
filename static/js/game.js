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

// THREEJS RELATED VARIABLES
var scene,camera, fieldOfView, aspectRatio, nearPlane, farPlane, renderer, container;

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH, mousePos = { x: 0, y: 0 };

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function createScene() {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
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

  window.addEventListener('resize', handleWindowResize, false);
}

// HANDLE SCREEN EVENTS

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
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


var AirPlane = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "airPlane";

  // Create the cabin
  var geomCockpit = new THREE.BoxGeometry(60,50,50,1,1,1);
  var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
  cockpit.castShadow = true;
  cockpit.receiveShadow = true;
  this.mesh.add(cockpit);

  // Create Engine
  var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
  var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
  var engine = new THREE.Mesh(geomEngine, matEngine);
  engine.position.x = 40;
  engine.castShadow = true;
  engine.receiveShadow = true;
  this.mesh.add(engine);

  // Create Tailplane

  var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
  var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
  tailPlane.position.set(-35,25,0);
  tailPlane.castShadow = true;
  tailPlane.receiveShadow = true;
  this.mesh.add(tailPlane);

  // Create Wing

  var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
  var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
  sideWing.position.set(0,0,0);
  sideWing.castShadow = true;
  sideWing.receiveShadow = true;
  this.mesh.add(sideWing);

  // Propeller

  var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
  var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
  this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
  this.propeller.castShadow = true;
  this.propeller.receiveShadow = true;

  // Blades

  var geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
  var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});

  var blade = new THREE.Mesh(geomBlade, matBlade);
  blade.position.set(8,0,0);
  blade.castShadow = true;
  blade.receiveShadow = true;
  this.propeller.add(blade);
  this.propeller.position.set(50,0,0);
  this.mesh.add(this.propeller);
};
// 3D Models
var airplane;

function createPlane(){
  airplane = new AirPlane();
  airplane.mesh.scale.set(.25,.25,.25);
  airplane.mesh.position.y = 100;
  scene.add(airplane.mesh);
}
function loop(){
//Planehere 
// update the plane on each frame
  updatePlane();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function updatePlane(){
//Planehere 
// let's move the airplane between -100 and 100 on the horizontal axis, 
// and between 25 and 175 on the vertical axis,
// depending on the mouse position which ranges between -1 and 1 on both axes;
// to achieve that we use a normalize function (see below)
  
  var targetY = normalize(mousePos.y,-.75,.75,125, 175);
  var targetX = normalize(mousePos.x,-.75,.75,-100, 100);
  
  //
  //var touchTargetY = normalize(touchPos.y,-.75,.75,25, 175);
  //var touchTargetX = normalize(touchPos.x,-.75,.75,-100, 100);
 
// update the airplane's position
  
  airplane.mesh.position.y = targetY;
  airplane.mesh.position.x = targetX;
  //airplane.mesh.position.y = touchTargetY;
  //airplane.mesh.position.x = touchTargetX;
  airplane.propeller.rotation.x += 0.3;
  
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
  
  //Mouse Event Listener
  //document.addEventListener('touchstart', onTouchMove, false);
  document.addEventListener('touchmove', handleMouseMove, false);
  loop();
}

// HANDLE MOUSE EVENTS
//Planehere
//var mousePos = { x: 0, y: 0 };
//var touchPos = { x: 0, y: 0 };

// now handle the mousemove event
function handleMouseMove(event) {
// here we are converting the mouse position value received 
// to a normalized value varying between -1 and 1;
// this is the formula for the horizontal axis:

  event.preventDefault();

  var tx = (event.clientX / WIDTH)*2 - 1;
  
// for the vertical axis, we need to inverse the formula 
// because the 2D y-axis goes the opposite direction of the 3D y-axis
  
  var ty = -(event.clientY / HEIGHT)*2 + 1;
  mousePos = {x:tx, y:ty};
  
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

			 console.log(garden);

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