// (function() {

// 	var capabilities = {
// 		orientation: true
// 	}

// 	var readers = {};


// 	if (window.DeviceOrientationEvent) {
//  		readers.orientation = "dev";
// 	} else if (window.OrientationEvent) {
//  		readers.orientation = "moz";
// 	} else {
//  		console.log("Device orientation events not available!");
//  		capabilities.orientation = false;
// 	}


// 	/******* Holder Vars **********/
// 	/*
// 	 * For reference, we need these holder vars because the default functionality of the device bindings are event listeners
// 	 * This presumably means that they will be called 100s of times per second - obviously way overloading the amount of times
// 	 * we can send data via socket.io per second.  Instead, we will store those variables locally, and allow the user
// 	 * to define (via setTimeout) how often they'd like to get an updated value.
// 	*/
// 	var orientation = {
// 		gamma: 0,
// 		beta: 0,
// 		alpha: 0,
// 		vaccel: 0
// 	}

// 	/******* Handler Functions *********/


// 	var orientationHandler = function(eventData) {
// 		var gamme;
// 		var beta;
// 		var alpha;
// 		var vaccel;

// 		if(readers.orientation === "dev") {

// 			// gamma is the left-to-right tilt in degrees, where right is positive
// 		   orientation.gamma = eventData.gamma;

// 		    // beta is the front-to-back tilt in degrees, where front is positive
// 		   orientation.beta = eventData.beta;

// 		    // alpha is the compass direction the device is facing in degrees
// 		   orientation.alpha = eventData.alpha

// 		    // deviceorientation does not provide this data
// 		   orientation.vaccel = null;
// 		} else if(readers.orientation === "moz") {
// 		    // x is the left-to-right tilt from -1 to +1, so we need to convert to degrees
// 		   orientation.gamma = eventData.x * 90;

// 		    // y is the front-to-back tilt from -1 to +1, so we need to convert to degrees
// 		    // We also need to invert the value so tilting the device towards us (forward) 
// 		    // results in a positive value. 
// 		   orientation.beta = eventData.y * -90;

// 		    // MozOrientation does not provide this data
// 		   orientation.alpha = null;

// 		    // z is the vertical acceleration of the device
// 		   orientation.vaccel = eventData.z;
// 		}
// 		orientation.vaccel = 100;
// 	} 






// 	/********** Reader Object **********/

// 	var bindings = {
// 		orientation: false
// 	}

// 	window.MobileReader = new function() {

// 		this.bindOrientation = function(opts) {
// 			if(capabilities.orientation) {
// 				var ev = readers.orientation === "dev" ? "deviceorientation" : "MozOrientation";

// 				window.addEventListener(ev, orientationHandler, false);

// 				var that = this;

// 				if(typeof(opts.callback) === "function" && typeof(opts.interval) !== "undefined") {
// 					return setInterval(function() { opts.callback(that.getOrientation()); }, opts.interval);
// 				}

// 				bindings.orientation = true;
// 			} else {
// 				throw new Error("This device is unable to bind to orientation events");
// 			}
// 		}

// 		this.getOrientation = function() {
// 			return orientation;
// 		}

// 	};

// })();




(function() {

	


	var capabilities = {
		orientation: true
	}

	var readers = {};


	if (window.DeviceOrientationEvent) {
 		readers.orientation = "dev";
	} else if (window.OrientationEvent) {
 		readers.orientation = "moz";
	} else {
 		console.log("Device orientation events not available!");
 		capabilities.orientation = false;
	}


	/******* Holder Vars **********/
	/*
	 * For reference, we need these holder vars because the default functionality of the device bindings are event listeners
	 * This presumably means that they will be called 100s of times per second - obviously way overloading the amount of times
	 * we can send data via socket.io per second.  Instead, we will store those variables locally, and allow the user
	 * to define (via setTimeout) how often they'd like to get an updated value.
	*/
	var orientation = {
		gamma: 0,
		beta: 0
	}

	/******* Handler Functions *********/


	var orientationHandler = function(eventData) {
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

};

AirPlane.prototype.updatePlane = function(xTargetMobile, yTargetMobile){
  
  this.tPosY = normalize(yTargetMobile, -.5,.25, 175, 25);
  this.tPosX = normalize(xTargetMobile, -.5,.5,-100, 100);
  this.mesh.position.y += (this.tPosY - this.mesh.position.y) /20;
  this.mesh.position.x += (this.tPosX - this.mesh.position.x) /20;
}

function loop(){
// update the plane on each frame
	var xTargetMobile = (mousePos.x-windowHalfX);
  	var yTargetMobile= (mousePos.y-windowHalfY);
	
  //updatePlane();
    airplane.updatePlane(xTargetMobile, yTargetMobile);

    console.log(xTargetMobile);
   
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
  loop();
}

window.addEventListener('load', init, false);


console.log("scene created");

		var gamma;
		var beta;

		if(readers.orientation === "dev") {

			// gamma is the left-to-right tilt in degrees, where right is positive
		   orientation.gamma = eventData.gamma;

		   //xTargetMobile = (mousePos.x-windowHalfX);
		   console.log(xTargetMobile);

		    // beta is the front-to-back tilt in degrees, where front is positive
		   orientation.beta = eventData.beta;

		   
		} else if(readers.orientation === "moz") {
		    // x is the left-to-right tilt from -1 to +1, so we need to convert to degrees
		   orientation.gamma = eventData.x * 90;

		    // y is the front-to-back tilt from -1 to +1, so we need to convert to degrees
		    // We also need to invert the value so tilting the device towards us (forward) 
		    // results in a positive value. 
		   orientation.beta = eventData.y * -90;

		    
		}
		
	} 






	/********** Reader Object **********/

	var bindings = {
		orientation: false
	}

	window.MobileReader = new function() {

		this.bindOrientation = function(opts) {
			if(capabilities.orientation) {
				var ev = readers.orientation === "dev" ? "deviceorientation" : "MozOrientation";

				window.addEventListener(ev, orientationHandler, false);

				var that = this;

				if(typeof(opts.callback) === "function" && typeof(opts.interval) !== "undefined") {
					return setInterval(function() { opts.callback(that.getOrientation()); }, opts.interval);
				}

				bindings.orientation = true;
			} else {
				throw new Error("This device is unable to bind to orientation events");
			}
		}

		this.getOrientation = function() {
			return orientation;
		}

	};

})();






