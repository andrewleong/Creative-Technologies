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

		// var balls = [];
		// var ballMass = 10;
		var curRotation = 0;
		// var len = $("#bar").width();
		// var accelModifier = .005;
  //       var friction = .005;
  //       var run = false
  var ball   = document.querySelector('.ball');
  var garden = document.querySelector('.garden');
  var output = document.querySelector('.output');

 var maxX = garden.clientWidth  - ball.clientWidth;
 var maxY = garden.clientHeight - ball.clientHeight;


 
  //var x = orientation.beta;  // In degree in the range [-180,180]
  //var y = orientation.gamma; // In degree in the range [-90,90]

		var init = function(e) {
			$(window).bind('orientation-change', orientationHandler);

			 

		};

		var orientationHandler = function(e, orientation) {
			
		var x = orientation.beta;

  			output.innerHTML  = "beta : " + x + "\n";
  			//output.innerHTML += "gamma: " + y + "\n";

  // Because we don't want to have the device upside down
  // We constrain the x value to the range [-90,90]
  if (x >  90) { x =  90};
  if (x < -90) { x = -90};

  // To make computation easier we shift the range of 
  // x and y to [0,180]
  x += 90;
  //y += 90;

  // 10 is half the size of the ball
  // It center the positioning point to the center of the ball
  ball.style.top  = (maxX*x/180 - 10) + "px";
  //ball.style.left = (maxY*y/180 - 10) + "px";
  
  console.log(orientation.beta);
  
		};

	
		$(window).bind('content-ready', init);

	});
})();