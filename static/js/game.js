
(function() {
	$(document).ready(function() {
   
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

			 var x = orientation.beta;  // In degree in the range [-180,180]
  			 var y = orientation.gamma; // In degree in the range [-90,90]

  			//output.innerHTML  = "beta : " + x + "\n";
  			//output.innerHTML += "gamma: " + y + "\n";

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
  
  //console.log("Beta" + orientation.beta);
  //console.log("MaxX" + maxX);
		};

		//content-ready function is triggered from main js mobile-on function
		$(window).bind('content-ready', init);

	});
})();