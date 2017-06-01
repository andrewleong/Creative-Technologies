//==REFERENCES & SOURCES USED==//

//--Wegner, J. (2013). An Experiment In Mobile Controllers [blog]. Available from http://wegnerdesign.com/blog/an-experiment-in-mobile-controllers/[Accessed: 4 April 2017].--//

//-- Vevo (2017). When Can I See You Again? (From Wreck it Ralph) - Owl City.[online] Available from: https://www.vevo.com/watch/owl-city/when-can-i-see-you-again-(fromwreck-it-ralph)/USWV21222257[Accessed 5 Apr. 2017].--//

(function() {

    //== Music ==//
    var gameMusic = new Audio('sound/Game.mp3');

    //== The main URL location.protocol is http: and location.host is the uri like localhost ==// 
    var baseUrl = document.location.protocol + "//" + document.location.host
    //var baseUrl = document.location.protocol + "//" + "192.168.1.71:3000"
    
    //== Variable for unique ID generator ==// 
    // var allChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    // var ranLength = 50;
    
    // var uniqueId = "";

    var uniqueId = "cornetto";
    
    //== Generates Unique ID ==//
    // for(var i=0; i<ranLength; i++) {
    //     uniqueId += allChars[Math.floor(Math.random() * allChars.length)];
    // }
    
    $(document).ready(function() {

        jQuery.urlShortener.settings.apiKey='AIzaSyAJxTUHTSPxpJ7iOwE033TCB-TxnSj8y0g';

        var Url = (baseUrl + "/mobile/" + uniqueId);
        console.log(Url);

        jQuery.urlShortener({
            longUrl: Url,
            success: function (shortUrl) {
                $("#qr_url").html(shortUrl);
            },
            error: function(err)
            {
                alert(JSON.stringify(err));
            }
      });

        // $("#qr").qrcode(baseUrl + "/mobile/" + uniqueId);
        $("#qr").qrcode(Url);
        
        //== connect to mobile socket ==//
        var socket = io.connect();

        //== Desktop socket sends server saying register its id with the unique ID ==//
        socket.emit('desktop-register', {id: uniqueId});

        //== Server says display instructions on desktop function when user is registered. ==//
        socket.on('deskShowInstructions', function(data) {

            $("#MainPage").slideUp(function() { });
  
        });

        //== Server says remove instructions and trigger Game start on desktop ==//
         socket.on('DeskGameStart', function(data) {
            $("#Instructions").slideUp(function() { 
              $(window).trigger('init'); 
              console.log("Let the Games Begin");
            });           
        });

//==REFERENCES & SOURCES USED==//

//-- Maaloul, K. (2016).The Making of “The Aviator”: Animating a Basic 3D Scene with Three.js [online]. Available from: https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/[Accessed: 4 April 2017]. --// 

$(window).bind('load', function (e) {

//== ThreeJs color variable code == //
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xfd7cce,
    brownDark:0x23190f,
    darkBrown:0x4a1506,
    blue:0x68c3c0,
    purple:0x9e5fb8,
    green:0xb5f8c2,
    orange:0xff5d00,
};

//== THREE JS GAME VARIABLES ==//
var game;
var deltaTime = 0;
var newTime = new Date().getTime();
var oldTime = new Date().getTime();
var obstaclesPool = [];
var particlesPool = [];
var particlesInUse = [];

var fieldDistance, energyBar, fieldLevel, levelCircle, myCounter, completed_header;

function resetGame(){
  game = {speed:0,
          initSpeed:.00035,
          baseSpeed:.00035,
          targetBaseSpeed:.00035,

          //incrementSpeedByTime:.0000025,
          incrementSpeedByTime:.00000025,
          incrementSpeedByLevel:.000005,
          distanceForSpeedUpdate:100,

          speedLastUpdate:0,

          distance:0,
          ratioSpeedDistance:50,
          energy:100,
          ratioSpeedEnergy:3,

          level:1,
          levelLastUpdate:0,
          distanceForLevelUpdate:1000,

          planeDefaultHeight:100,
          planeAmpHeight:60,
          planeAmpWidth:105,
          planeMoveSensivity:0.005,
          planeRotXSensivity:0.0008,
          planeRotZSensivity:0.0004,
          planeFallSpeed:.001,
          planeMinSpeed:1.2,
          planeMaxSpeed:1.6,
          planeSpeed:0,

          planeCollisionDisplacementX:0,
          planeCollisionDisplacementY:0,
          planeCollisionSpeedX:0,
          planeCollisionSpeedY:0,

          seaRadius:600,
          seaLength:800,
  
          wavesMinAmp : 5,
          wavesMaxAmp : 20,
          wavesMinSpeed : 0.001,
          wavesMaxSpeed : 0.003,

          counter: 0,
          coinDistanceTolerance:40,
          coinValue:3,
          coinsSpeed:.5,
          coinLastSpawn:0,
          distanceForCoinsSpawn:50,

          //Enemy collision distance
          obstaclesDistanceTolerance:40,
          obstaclesValue:20,
          obstaclesSpeed:.6,
          obstaclesLastSpawn:0,
          distanceForObstaclesSpawn:50,

          status : "playing",
         
         };

  fieldLevel.innerHTML = Math.floor(game.level);
}

//== Variable Coordinates of player ==//    
var myStateX = {};
var myStateY = {};

//== Received new coordinates of player then setNewPosition ==//    
  socket.on('newPosition', function(newMobileX, newMobileY) {   
      myStateX = newMobileX;
      myStateY = newMobileY;
      setNewPosition(myStateX, myStateY);  
  });

//== THREEJS RELATED Scene VARIABLES ==//
var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, renderer, container;

//== SCREEN & MOUSE VARIABLES ==//
var HEIGHT, WIDTH, windowHalfX, windowHalfY;

var mousePos = {x:0,y:0};    

function createScene() {
  // Get the width and the height of the screen,
  // use them to set up the aspect ratio of the camera 
  // and the size of the renderer.
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // Create the scene
  scene = new THREE.Scene();  
  
  // Create the camera
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

  //== Add a fog effect to the scene; same color as the background color used in the style sheet ==//
  // scene.fog = new THREE.Fog(0xf7d9aa, 100,950);
  scene.fog = new THREE.Fog(0xc8eefb, 100,950);

  //== Set the position of the camera ==//
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = game.planeDefaultHeight;

  //== Allow transparency to show the gradient background we defined in the CSS / Activate the anti-aliasing; this is less performant, 
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  //== Define the size of the renderer; in this case, it will fill the entire screen ==//
  renderer.setSize(WIDTH, HEIGHT);

  //== Enable shadow rendering ==//
  renderer.shadowMap.enabled = true;

  //== Add the DOM element of the renderer to the container we created in the HTML ==//
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);
  
  windowHalfX = WIDTH / 4;
  windowHalfY = HEIGHT / 4;

  //== Listen to the screen: if the user resizes it we have to update the camera and the renderer size ==//
  window.addEventListener('resize', handleWindowResize, false);
}

//== HANDLE SCREEN EVENTS ==//
function handleWindowResize() {
  
  //== update height and width of the renderer and the camera ==//
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 4;
  windowHalfY = HEIGHT / 4;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

//== HANDLE LIGHTS ==//

var ambientLight, hemisphereLight, shadowLight;

function createLights() {

  //== A hemisphere light is a gradient colored light; the first parameter is the sky color, the second parameter is the ground color, the third parameter is the intensity of the light ==//
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);

  //== an ambient light modifies the global color of a scene and makes the shadows softer ==//
  ambientLight = new THREE.AmbientLight(0xfcc3ee, .1);

  //== A directional light shines from a specific direction.It acts like the sun, that means that all the rays produced are parallel. ==// 
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);

  //== Set the direction of the light ==// 
  shadowLight.position.set(450, 350, 350);

  //== Allow shadow casting ==//
  shadowLight.castShadow = true;

  //== define the visible area of the projected shadow ==//
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  //== define the resolution of the shadow; the higher the better,but also the more expensive and less performant ==//
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  //== to activate the lights, just add them to the scene ==//
  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(ambientLight);

}

//== Building the 3D OBJECTS ==//

//SEA Model

Sea = function(){
  
  //== create the geometry (shape) of the cylinder the parameters are: radius top, radius bottom, height, number of segments on the radius, number of segments vertically ==//
  var geom = new THREE.CylinderGeometry(600,600,800,40,10);
  
  //== rotate the geometry on the x axis ==//
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

  //== important: by merging vertices we ensure the continuity of the waves ==//
  geom.mergeVertices();

  //== get the vertices ==//
  var l = geom.vertices.length;

  //== create an array to store new data associated to each vertex ==//
  this.waves = [];

  for (var i=0; i<l; i++){
    
    //== get each vertex ==//
    var v = geom.vertices[i];

    //== store some data associated to it ==//
    this.waves.push({y:v.y, x:v.x, z:v.z,
                     
                     //== a random angle ==//
                     ang:Math.random()*Math.PI*2,
                     //== a random distance ==//
                     amp:5 + Math.random()*15,
                     //== a random speed between 0.016 and 0.048 radians / frame ==//
                     speed:0.016 + Math.random()*0.032
                    });
  };
  
  //== create the material ==// 
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.pink,
    transparent:true,
    opacity:.9,
    shading:THREE.FlatShading,
  });

  //== To create an object in Three.js, a mesh needs to be created which is a combination of a geometry and some material ==//
  this.mesh = new THREE.Mesh(geom, mat);

  //== Allow the mesh to receive shadows ==//
  this.mesh.receiveShadow = true; 
}

//== now create the function that will be called in each frame to update the position of the vertices to simulate the waves ==//
Sea.prototype.moveWaves = function (){
  
  //== get the vertices ==//
  var verts = this.mesh.geometry.vertices;
  var l = verts.length;
  
  for (var i=0; i<l; i++){
    var v = verts[i];
    
    //== get the data associated to it ==//
    var vprops = this.waves[i];
    
    //== update the position of the vertex ==//
    v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
    v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

    //== increment the angle for the next frame ==//
    vprops.ang += vprops.speed;

  }

  //== Tell the renderer that the geometry of the sea has changed.In fact, in order to maintain the best level of performance,three.js caches the geometries and ignores any changes
  this.mesh.geometry.verticesNeedUpdate=true;
  sea.mesh.rotation.z += .005;
}

//== Sky ==//
Sky = function(){
  this.mesh = new THREE.Object3D();
  this.nClouds = 20;
  this.clouds = [];
  var stepAngle = Math.PI*2 / this.nClouds;
  for(var i=0; i<this.nClouds; i++){
    var c = new Cloud();
    this.clouds.push(c);
    var a = stepAngle*i;
    var h = 750 + Math.random()*200;
    c.mesh.position.y = Math.sin(a)*h;
    c.mesh.position.x = Math.cos(a)*h;
    c.mesh.position.z = -400-Math.random()*100;
    c.mesh.rotation.z = a + Math.PI/2;
    var s = 1+Math.random()*2;
    c.mesh.scale.set(s,s,s);
    this.mesh.add(c.mesh);
  }
}

Sky.prototype.moveClouds = function(){
  for(var i=0; i<this.nClouds; i++){
    var c = this.clouds[i];
    c.rotate();
  }
  this.mesh.rotation.z += game.speed*deltaTime;

}

Cloud = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  var geom = new THREE.DodecahedronGeometry(8,0);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.white, transparent: true, opacity: 0.9, specular:0xffffff, shading:THREE.FlatShading
  });

  //mat.opacity = 0.6;

  var nBlocs = 3+Math.floor(Math.random()*3);
  for (var i=0; i<nBlocs; i++ ){
    var m = new THREE.Mesh(geom.clone(), mat);
    m.position.x = i*15;
    m.position.y = Math.random()*10;
    m.position.z = Math.random()*10;
    m.rotation.z = Math.random()*Math.PI*2;
    m.rotation.y = Math.random()*Math.PI*2;
    var s = .1 + Math.random()*.9;
    m.scale.set(s,s,s);
    m.castShadow = true;
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}

Cloud.prototype.rotate = function(){
  var l = this.mesh.children.length;
  for(var i=0; i<l; i++){
    var m = this.mesh.children[i];
    m.rotation.z+= Math.random()*.005*(i+1);
    m.rotation.y+= Math.random()*.002*(i+1);
  }
}

//== Obstacles ==//
Obstacles = function(){
  var geom = new THREE.TetrahedronGeometry(8,2);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.orange,
    shininess:1,
    specular:0xffffff,
    shading:THREE.FlatShading
  });
  this.mesh = new THREE.Mesh(geom,mat);
  this.mesh.scale.set(2,2,2);
  this.mesh.castShadow = true;
  this.angle = 0;
  this.dist = 0;
}

ObstaclesHolder = function (){
  this.mesh = new THREE.Object3D();
  this.obstaclesInUse = [];
}

ObstaclesHolder.prototype.spawnObstacles = function(){
  var nObstacles = game.level;

  for (var i=0; i<nObstacles; i++){
    var obstacles;
    if (obstaclesPool.length) {
      obstacles = obstaclesPool.pop();
    }else{
      obstacles = new Obstacles();
    }

    obstacles.angle = - (i*0.1);
    obstacles.distance = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 3) * (game.planeAmpHeight-50);
    obstacles.mesh.position.y = -game.seaRadius + Math.sin(obstacles.angle)*obstacles.distance;
    obstacles.mesh.position.x = Math.cos(obstacles.angle)*obstacles.distance;


    this.mesh.add(obstacles.mesh);
    this.obstaclesInUse.push(obstacles);
  }
}

ObstaclesHolder.prototype.rotateObstacles = function(){
  for (var i=0; i<this.obstaclesInUse.length; i++){
    var obstacles = this.obstaclesInUse[i];
    obstacles.angle += game.speed*deltaTime*game.obstaclesSpeed;

    if (obstacles.angle > Math.PI*2) obstacles.angle -= Math.PI*2;

    obstacles.mesh.position.y = -game.seaRadius + Math.sin(obstacles.angle)*obstacles.distance;
    obstacles.mesh.position.x = Math.cos(obstacles.angle)*obstacles.distance;
    obstacles.mesh.rotation.z += Math.random()*.1;
    obstacles.mesh.rotation.y += Math.random()*.1;

    var diffPos = ice_cream.position.clone().sub(obstacles.mesh.position.clone());
    var d = diffPos.length();
    if (d<game.obstaclesDistanceTolerance){
      particlesHolder.spawnParticles(obstacles.mesh.position.clone(), 15, Colors.orange, 3);

      obstaclesPool.unshift(this.obstaclesInUse.splice(i,1)[0]);
      this.mesh.remove(obstacles.mesh);
      
      //== WHen player got hit, player position runs out of post ==//
      game.planeCollisionSpeedX = 100 * diffPos.x / d;
      game.planeCollisionSpeedY = 100 * diffPos.y / d;
      
      removeEnergy();
      i--;
    
    }else if (obstacles.angle > Math.PI){
      obstaclesPool.unshift(this.obstaclesInUse.splice(i,1)[0]);
      this.mesh.remove(obstacles.mesh);
      i--;
    }
  }
}


Particle = function(){
  var geom = new THREE.TetrahedronGeometry(3,0);
  var mat = new THREE.MeshPhongMaterial({
    //color:0x009999,
    color:Colors.red,
    shininess:0,
    specular:0xffffff,
    shading:THREE.FlatShading
  });
  this.mesh = new THREE.Mesh(geom,mat);
}
//For the Love objects explosion
Particle.prototype.explode = function(pos, color, scale){
  var _this = this;
  var _p = this.mesh.parent;
  this.mesh.material.color = new THREE.Color(color);
  this.mesh.material.needsUpdate = true;
  this.mesh.scale.set(scale, scale, scale);
  var targetX = pos.x + (-1 + Math.random()*2)*50;
  var targetY = pos.y + (-1 + Math.random()*2)*50;
  var speed = .6+Math.random()*.2;
  TweenMax.to(this.mesh.rotation, speed, {x:Math.random()*12, y:Math.random()*12});
  TweenMax.to(this.mesh.scale, speed, {x:.1, y:.1, z:.1});
  TweenMax.to(this.mesh.position, speed, {x:targetX, y:targetY, delay:Math.random() *.1, ease:Power2.easeOut, onComplete:function(){
      if(_p) _p.remove(_this.mesh);
      _this.mesh.scale.set(1,1,1);
      particlesPool.unshift(_this);
    }});
}

ParticlesHolder = function (){
  this.mesh = new THREE.Object3D();
  this.particlesInUse = [];
}

ParticlesHolder.prototype.spawnParticles = function(pos, density, color, scale){

  var nPArticles = density;
  for (var i=0; i<nPArticles; i++){
    var particle;
    if (particlesPool.length) {
      particle = particlesPool.pop();
    }else{
      particle = new Particle();
    }
    this.mesh.add(particle.mesh);
    particle.mesh.visible = true;
    var _this = this;
    particle.mesh.position.y = pos.y;
    particle.mesh.position.x = pos.x;
    particle.explode(pos,color, scale);
  }
}


var loader = new THREE.JSONLoader();

 Coin = function(){
var xheart = 0;
var yheart = 0;
var heartShape = new THREE.Shape();
heartShape.moveTo( xheart + 25, yheart + 25 );
heartShape.bezierCurveTo( xheart + 25, yheart + 25, xheart + 20, yheart, xheart, yheart );
heartShape.bezierCurveTo( xheart - 30, yheart, xheart - 30, yheart + 35,xheart - 30,yheart + 35 );
heartShape.bezierCurveTo( xheart - 30, yheart + 55, xheart - 10, yheart + 77, xheart + 25, yheart + 95 );
heartShape.bezierCurveTo( xheart + 60, yheart + 77, xheart + 80, yheart + 55, xheart + 80, yheart + 35 );
heartShape.bezierCurveTo( xheart + 80, yheart + 35, xheart + 80, yheart, xheart + 50, yheart );
heartShape.bezierCurveTo( xheart + 35, yheart, xheart + 25, yheart + 25, xheart + 25, yheart + 25 );

  var geom = new THREE.ExtrudeGeometry(heartShape, {
    amount: 16, 
    bevelEnabled: true, 
    bevelSegments: 2, 
    steps: 2, 
    bevelSize: 1, 
    bevelThickness: 1 
  });
  var mat = new THREE.MeshPhongMaterial({
    //color:0x009999,
    color: Colors.red, 
    shininess:0,
    specular:0xffffff,

    shading:THREE.FlatShading
  });
  
  this.mesh = new THREE.Mesh(geom,mat);
  this.mesh.castShadow = true;
  this.angle = 0;
  this.dist = 0;
  this.mesh.scale.set(0.09,0.09,0.09);    
    
}

 CoinsHolder = function (nCoins){
  this.mesh = new THREE.Object3D();
  //scene.add (this.mesh);
  this.coinsInUse = [];
  this.coinsPool = [];
  for (var i=0; i<nCoins; i++){
    var coin = new Coin();
    this.coinsPool.push(coin);
    //console.log(CoinsHolder);
  }
}

CoinsHolder.prototype.spawnCoins = function(){
  // //how much coins it will produce
  var nCoins = 1 + Math.floor(Math.random()*10);
  // the height
  var d = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight-20);
  // like a wavelenth..how it lines up
  var amplitude = 10 + Math.round(Math.random()*10);
  
  for (var i=0; i<nCoins; i++){
    var coin;
    if (this.coinsPool.length) {
      coin = this.coinsPool.pop();
    }else{
      coin = new Coin();
    }
    this.mesh.add(coin.mesh);
    this.coinsInUse.push(coin);
    coin.angle = - (i*0.02);
    coin.distance = d + Math.cos(i*.5)*amplitude;
    coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle)*coin.distance;
    coin.mesh.position.x = Math.cos(coin.angle)*coin.distance;
  }
}

CoinsHolder.prototype.rotateCoins = function(){
  for (var i=0; i<this.coinsInUse.length; i++){
    var coin = this.coinsInUse[i];
    if (coin.exploding) continue;
    coin.angle += game.speed*deltaTime*game.coinsSpeed;
    if (coin.angle>Math.PI*2) coin.angle -= Math.PI*2;
    coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle)*coin.distance;
    coin.mesh.position.x = Math.cos(coin.angle)*coin.distance;
    coin.mesh.rotation.z += Math.random()*.1;
    coin.mesh.rotation.y += Math.random()*.1;

    //var globalCoinPosition =  coin.mesh.localToWorld(new THREE.Vector3());
    var diffPos = ice_cream.position.clone().sub(coin.mesh.position.clone());
    var d = diffPos.length();
    //If collided coins
    if (d<game.coinDistanceTolerance){
      this.coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
      this.mesh.remove(coin.mesh);
      particlesHolder.spawnParticles(coin.mesh.position.clone(), 5, Colors.red, .8);
      addEnergy();
      i--;
      countCoins();
      
    }else if (coin.angle > Math.PI){
      this.coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
      this.mesh.remove(coin.mesh);
      i--;
    }
  }
}

// ----ENEMIES ENDED------//


// 3D Object instantiation/create function
// Instantiate the Objects and add it to the scene:
var sea;
function createSea(){
  sea = new Sea();
  // push it a little bit at the bottom of the scene
  sea.mesh.position.y = -600;
  // add the mesh of the sea to the scene
  scene.add(sea.mesh);
}

var sky;
function createSky(){
  sky = new Sky();
  sky.mesh.position.y = -600;
  scene.add(sky.mesh);
}


var ice_cream;

function createPlane(){
 loader.load("models/ice_cream.js", function(geometry, materials){

  var material = new THREE.MultiMaterial(materials);
  ice_cream = new THREE.Mesh(geometry, material);
  ice_cream.scale.set(20,20,20);
    
  ice_cream.position.y = game.planeDefaultHeight;
  //ice_cream.rotation.z = 80;
  ice_cream.rotation.z = Math.PI / -2;
   ice_cream.castShadow = true;
   ice_cream.receiveShadow = true;
  scene.add(ice_cream);
  });
}

function createCoins(){
  coinsHolder = new CoinsHolder(20);
  scene.add(coinsHolder.mesh);
}

function createObstacles(){
  for (var i=0; i<10; i++){
    var obstacles = new Obstacles();
    obstaclesPool.push(obstacles);
  }
  obstaclesHolder = new ObstaclesHolder();
  //ennemiesHolder.mesh.position.y = -game.seaRadius;
  scene.add(obstaclesHolder.mesh)
}

function createParticles(){
  for (var i=0; i<10; i++){
    var particle = new Particle();
    particlesPool.push(particle);
  }
  particlesHolder = new ParticlesHolder();
  //ennemiesHolder.mesh.position.y = -game.seaRadius;
  scene.add(particlesHolder.mesh)
}

 function updatePlane (xTarget, yTarget){

    if(ice_cream !== undefined){
  game.planeSpeed = normalize(xTarget,-.5,.5,game.planeMinSpeed, game.planeMaxSpeed);
    
  ice_cream.tPosY = normalize(yTarget,-.5,.25, game.planeDefaultHeight+game.planeAmpHeight, game.planeDefaultHeight-game.planeAmpHeight);
  ice_cream.tPosX = normalize(xTarget,-.5,.5,-game.planeAmpWidth*.8, game.planeAmpWidth);

  game.planeCollisionDisplacementX += game.planeCollisionSpeedX;
  ice_cream.tPosX += game.planeCollisionDisplacementX;


  game.planeCollisionDisplacementY += game.planeCollisionSpeedY;
  ice_cream.tPosY += game.planeCollisionDisplacementY;

  ice_cream.position.y += (ice_cream.tPosY - ice_cream.position.y)*deltaTime*game.planeMoveSensivity;
  ice_cream.position.x += (ice_cream.tPosX - ice_cream.position.x)*deltaTime*game.planeMoveSensivity;

  game.planeCollisionSpeedX += (0-game.planeCollisionSpeedX)*deltaTime * 0.03;
  game.planeCollisionDisplacementX += (0-game.planeCollisionDisplacementX)*deltaTime *0.01;
  game.planeCollisionSpeedY += (0-game.planeCollisionSpeedY)*deltaTime * 0.03;
  game.planeCollisionDisplacementY += (0-game.planeCollisionDisplacementY)*deltaTime *0.01;
  }
} 

function setNewPosition(myStateX, myStateY){
      
    var xTarget = (myStateX-windowHalfX);
    var yTarget = (myStateY-windowHalfY);
    
    updatePlane(xTarget, yTarget);     
 }

var reqLoop;
function loop(){
  renderer.render(scene, camera);
  reqLoop = requestAnimationFrame(loop);

  newTime = new Date().getTime();
  deltaTime = newTime-oldTime;
  oldTime = newTime;

  if (game.status=="playing"){

    // Add energy coins every 100m;
    if (Math.floor(game.distance)%game.distanceForCoinsSpawn == 0 && Math.floor(game.distance) > game.coinLastSpawn){
      game.coinLastSpawn = Math.floor(game.distance);
      coinsHolder.spawnCoins();
    }

    if (Math.floor(game.distance)%game.distanceForSpeedUpdate == 0 && Math.floor(game.distance) > game.speedLastUpdate){
      game.speedLastUpdate = Math.floor(game.distance);
      game.targetBaseSpeed += game.incrementSpeedByTime*deltaTime;
    }

    if (Math.floor(game.distance)%game.distanceForObstaclesSpawn == 0 && Math.floor(game.distance) > game.obstaclesLastSpawn){
      game.obstaclesLastSpawn = Math.floor(game.distance);
      obstaclesHolder.spawnObstacles();
    }

    if (Math.floor(game.distance)%game.distanceForLevelUpdate == 0 && Math.floor(game.distance) > game.levelLastUpdate){
      game.levelLastUpdate = Math.floor(game.distance);
      game.level++;
      fieldLevel.innerHTML = Math.floor(game.level);

      game.targetBaseSpeed = game.initSpeed + game.incrementSpeedByLevel*game.level
    }

    updateDistance();
    updateEnergy();
   

    game.baseSpeed += (game.targetBaseSpeed - game.baseSpeed) * deltaTime * 0.02;
    game.speed = game.baseSpeed * game.planeSpeed;

  }else if(game.status=="gameover"){
    game.speed *= .99;
   ice_cream.rotation.z += (-Math.PI/2 - ice_cream.rotation.z)*.0002*deltaTime;
   ice_cream.rotation.x += 0.0003*deltaTime;
    game.planeFallSpeed *= 1.05;
   ice_cream.position.y -= game.planeFallSpeed*deltaTime;

    if (ice_cream.position.y <-200){
      showFinishGame();
      game.status = "waitingStatus";

    }
  }else if (game.status=="waitingStatus"){

  }

  game.planeSpeed * deltaTime*.005;
  
  sea.mesh.rotation.z += game.speed*deltaTime;//*game.seaRotationSpeed;


  coinsHolder.rotateCoins();
  obstaclesHolder.rotateObstacles();

}//end of loop
  

 
 function movingBG(){
  if ( sea.mesh.rotation.z > 2*Math.PI)  sea.mesh.rotation.z -= 2*Math.PI;
  sky.moveClouds();
  sea.moveWaves();
  requestAnimationFrame(movingBG);
 }

function updateDistance(){
  game.distance += game.speed*deltaTime*game.ratioSpeedDistance;
  fieldDistance.innerHTML = Math.floor(game.distance);
  var d = 502*(1-(game.distance%game.distanceForLevelUpdate)/game.distanceForLevelUpdate);
  levelCircle.setAttribute("stroke-dashoffset", d);

}

var blinkEnergy=false;

function updateEnergy(){
  game.energy -= game.speed*deltaTime*game.ratioSpeedEnergy;
  game.energy = Math.max(0, game.energy);
  // energyBar.style.right = (100-game.energy)+"%";
  energyBar.style.right = (100-game.energy)+"%";
  energyBar.style.backgroundColor = (game.energy<50)? "#f25346" : "#68c3c0";

  if (game.energy<30){
    energyBar.style.animationName = "blinking";
  }else{
    energyBar.style.animationName = "none";
  }

  if (game.energy <1){
    game.status = "gameover";
  }
}

function countCoins(){
  game.counter ++;
  myCounter.innerHTML = game.counter;
  
  console.log(game.counter);

}

function addEnergy(){
  game.energy += game.coinValue;
  game.energy = Math.min(game.energy, 100);
  var itemCollectSound = new Audio('sound/item_collect.wav');
  itemCollectSound.play();
}

function removeEnergy(){
  game.energy -= game.obstaclesValue;
  var gotHitSound = new Audio('sound/got_hit.wav');
  gotHitSound.play();
  //game.energy -= 0.001;
  game.energy = Math.max(0, game.energy);
}

function showFinishGame(){

    if(game.counter >= 20){
      socket.emit('goSocialMedia');
      cancelAnimationFrame(reqLoop);
      $("#social-media").css("z-index","30000");
      completed_header.innerText = "Congratulations you have collected" + ' ' + game.counter + ' ' + "points!! \n"  + "Look at phone.";
      console.log("congrats");
    }else{
      $("#game-over").css("z-index","30000");
          console.log("failed");
    }
}

function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

//Bind the initialization function
$(window).bind('init', function (e) {
  gameMusic.play();
  gameMusic.loop = true; 
  // UI
  myCounter = document.getElementById("counterValue");
  completed_header = document.getElementById("completed-header");
  fieldDistance = document.getElementById("distValue");
  energyBar = document.getElementById("energyBar");
  fieldLevel = document.getElementById("levelValue");
  levelCircle = document.getElementById("levelCircleStroke");

  resetGame();

  //Create stuff
  createScene();
  createLights();
  createPlane();
  createSea();
  createSky();

  createCoins();
  createObstacles();
  createParticles();

  //Loops
  loop();
  movingBG();

  //Inside the init function, triggers the load function
   $(window).trigger('load');
   
  console.log("init functioned")

    });

//== End of MyGame ==//

  });//end of gameStart   
    
  });
})();