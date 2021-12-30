// Set date
var countdownDate = new Date(
	"January 1, 2022 00:00:00"
).getTime(); /* hrs: min: sec */

// Update the count down every 1 second
var x = setInterval(function () {
	// Get todays date and time
	var now = new Date().getTime();

	// Find the distance between now and the count down date
	var distance = countdownDate - now;

	// Time calculations for days, hours, minutes and seconds
	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	// Display the result in the element
	document.querySelector("#d").innerText = addZero(days);
	document.querySelector("#h").innerText = addZero(hours);
	document.querySelector("#m").innerText = addZero(minutes);
	document.querySelector("#s").innerText = addZero(seconds);

	// If the count down is finished, write some text
	if (distance < 0) {
		clearInterval(x);
		window.location.href = "https://www.rohittechzone.com/newyear/";
	}
}, 1000);
function addZero(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}
function isMobile() {
	if (window.innerWidth < 775) {
		return true;
	} else {
		return false;
	}
}

/********************
    Animation Frame
  ********************/

window.requestAnimFrame = (function () {
	return (
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		}
	);
})();

/********************
    Vars
  ********************/
var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"),
	cw = window.innerWidth,
	ch = window.innerHeight,
	fireworks = [],
	particles = [],
	hue = 120, // starting hue
	limiterTotal = 5, // limit 5 when click trigger
	limiterTick = 0, // launch timer
	timerTotal = 80,
	timerTick = 0,
	mousedown = false,
	mx, // mouse x coordinate,
	my; // mouse y coordinate

// set canvas dimensions
canvas.width = cw;
canvas.height = ch;

/********************
    Helper Functions
  ********************/

function random(min, max) {
	return Math.random() * (max - min) + min;
}

function calculateDistance(p1x, p1y, p2x, p2y) {
	var xDistance = p1x - p2x,
		yDistance = p1y - p2y;
	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

/********************
    Fireworks
  ********************/
function Firework(sx, sy, tx, ty) {
	// actual coordinates
	this.x = sx;
	this.y = sy;
	// starting coordinates
	this.sx = sx;
	this.sy = sy;
	// target coordinates
	this.tx = tx;
	this.ty = ty;
	// distance from starting point to target
	this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
	this.distanceTraveled = 0;
	// track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
	this.coordinates = [];
	this.coordinateCount = 3;
	// populate initial coordinate collection with the current coordinates
	while (this.coordinateCount--) {
		this.coordinates.push([this.x, this.y]);
	}
	this.angle = Math.atan2(ty - sy, tx - sx);
	this.speed = 2;
	this.acceleration = 1.05;
	this.brightness = random(50, 70);
	// circle target indicator radius
	this.targetRadius = 1;
}

// update firework
Firework.prototype.update = function (index) {
	// remove last item in coordinates array
	this.coordinates.pop();
	// add current coordinates to the start of the array
	this.coordinates.unshift([this.x, this.y]);
	// cycle the circle target indicator radius
	if (this.targetRadius < 8) {
		this.targetRadius += 0.3;
	} else {
		this.targetRadius = 1;
	}
	// speed up the firework
	this.speed *= this.acceleration;
	// get the current velocities based on angle and speed
	var vx = Math.cos(this.angle) * this.speed,
		vy = Math.sin(this.angle) * this.speed;
	// how far will the firework have traveled with velocities applied?
	this.distanceTraveled = calculateDistance(
		this.sx,
		this.sy,
		this.x + vx,
		this.y + vy
	);
	// if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
	if (this.distanceTraveled >= this.distanceToTarget) {
		createParticles(this.tx, this.ty);
		fireworks.splice(index, 1); // remove the firework, use the index passed into the update function to determine which to remove
	} else {
		// target not reached, keep traveling
		this.x += vx;
		this.y += vy;
	}
};

// draw firework
Firework.prototype.draw = function () {
	ctx.beginPath();
	ctx.moveTo(
		this.coordinates[this.coordinates.length - 1][0],
		this.coordinates[this.coordinates.length - 1][1]
	); // move to the last tracked coordinate in the set, then draw a line to the current x and y
	ctx.lineTo(this.x, this.y);
	ctx.strokeStyle = "hsl(" + hue + ", 100%, " + this.brightness + "%)";
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2); // draw the target for this firework with a pulsing circle
	ctx.stroke();
};

/********************
    Particle Prototype
  ********************/

function Particle(x, y) {
	this.x = x;
	this.y = y;
	// track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
	this.coordinates = [];
	this.coordinateCount = 5;
	while (this.coordinateCount--) {
		this.coordinates.push([this.x, this.y]);
	}
	// set a random angle in all possible directions, in radians
	this.angle = random(0, Math.PI * 2);
	this.speed = random(1, 10);
	// friction will slow the particle down
	this.friction = 0.95;
	// gravity will be applied and pull the particle down
	this.gravity = 1;
	// set the hue to a random number +-50 of the overall hue variable
	this.hue = random(hue - 50, hue + 50);
	this.brightness = random(50, 80);
	this.alpha = 1;
	// set how fast the particle fades out
	this.decay = random(0.015, 0.03);
}

Particle.prototype.update = function (index) {
	// remove last item in coordinates array
	this.coordinates.pop();
	// add current coordinates to the start of the array
	this.coordinates.unshift([this.x, this.y]);
	// slow down the particle
	this.speed *= this.friction;
	// apply velocity
	this.x += Math.cos(this.angle) * this.speed;
	this.y += Math.sin(this.angle) * this.speed + this.gravity;
	// fade out the particle
	this.alpha -= this.decay;

	// remove the particle once the alpha is low enough, based on the passed in index
	if (this.alpha <= this.decay) {
		particles.splice(index, 1);
	}
};

// draw particle
Particle.prototype.draw = function () {
	ctx.beginPath();
	ctx.moveTo(
		this.coordinates[this.coordinates.length - 1][0],
		this.coordinates[this.coordinates.length - 1][1]
	); // move to the last tracked coordinates in the set, then draw a line to the current x and y
	ctx.lineTo(this.x, this.y);
	ctx.strokeStyle =
		"hsla(" + this.hue + ", 100%, " + this.brightness + "%, " + this.alpha + ")";
	ctx.stroke();
};

// create particle group & explosion
function createParticles(x, y) {
	var particleCount = 30; // increase the particle count for a bigger explosion
	while (particleCount--) {
		particles.push(new Particle(x, y));
	}
}

/********************
    Update
  ********************/

function update() {
	requestAnimFrame(update);

	// increase the hue to get different colored fireworks over time
	//hue += 0.5;

	// create random color
	hue = random(0, 360);

	// clearRect() with opacity
	ctx.globalCompositeOperation = "destination-out";
	// decrease the alpha property to create more prominent trails
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
	ctx.fillRect(0, 0, cw, ch);
	// change the composite operation back to our main mode
	// lighter creates bright highlight points as the fireworks and particles overlap each other
	ctx.globalCompositeOperation = "lighter";

	// loop over each firework, draw it, update it
	var i = fireworks.length;
	while (i--) {
		fireworks[i].draw();
		fireworks[i].update(i);
	}

	// loop over each particle, draw it, update it
	var i = particles.length;
	while (i--) {
		particles[i].draw();
		particles[i].update(i);
	}

	// launch fireworks automatically to random coordinates, when the mouse isn't down
	if (timerTick >= timerTotal) {
		if (!mousedown) {
			// start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
			fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2)));
			timerTick = 0;
		}
	} else {
		timerTick++;
	}

	// limit the rate at which fireworks get launched when mouse is down
	if (limiterTick >= limiterTotal) {
		if (mousedown) {
			// start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
			fireworks.push(new Firework(cw / 2, ch, mx, my));
			limiterTick = 0;
		}
	} else {
		limiterTick++;
	}
}

function onResize() {
	cw = window.innerWidth;
	ch = window.innerHeight;
	canvas.width = cw;
	canvas.height = ch;
}

/********************
    Event Listeners
  ********************/

canvas.addEventListener("mousemove", function (e) {
	mx = e.pageX - canvas.offsetLeft;
	my = e.pageY - canvas.offsetTop;
});

canvas.addEventListener("mousedown", function (e) {
	e.preventDefault();
	mousedown = true;
});

canvas.addEventListener("mouseup", function (e) {
	e.preventDefault();
	mousedown = false;
});

window.addEventListener("resize", onResize);

window.onload = update;

var snowStorm = (function(window, document) {

	// --- common properties ---
  
	this.autoStart = true;          // Whether the snow should start automatically or not.
	this.excludeMobile = true;      // Snow is likely to be bad news for mobile phones' CPUs (and batteries.) Enable at your own risk.
	this.flakesMax = 128;           // Limit total amount of snow made (falling + sticking)
	this.flakesMaxActive = 64;      // Limit amount of snow falling at once (less = lower CPU use)
	this.animationInterval = 50;    // Theoretical "miliseconds per frame" measurement. 20 = fast + smooth, but high CPU use. 50 = more conservative, but slower
	this.useGPU = true;             // Enable transform-based hardware acceleration, reduce CPU load.
	this.className = null;          // CSS class name for further customization on snow elements
	this.excludeMobile = true;      // Snow is likely to be bad news for mobile phones' CPUs (and batteries.) By default, be nice.
	this.flakeBottom = null;        // Integer for Y axis snow limit, 0 or null for "full-screen" snow effect
	this.followMouse = false;        // Snow movement can respond to the user's mouse
	this.snowColor = '#fff';        // Don't eat (or use?) yellow snow.
	this.snowCharacter = '&bull;';  // &bull; = bullet, &middot; is square on some systems etc.
	this.snowStick = true;          // Whether or not snow should "stick" at the bottom. When off, will never collect.
	this.targetElement = null;      // element which snow will be appended to (null = document.body) - can be an element ID eg. 'myDiv', or a DOM node reference
	this.useMeltEffect = true;      // When recycling fallen snow (or rarely, when falling), have it "melt" and fade out if browser supports it
	this.useTwinkleEffect = false;  // Allow snow to randomly "flicker" in and out of view while falling
	this.usePositionFixed = false;  // true = snow does not shift vertically when scrolling. May increase CPU load, disabled by default - if enabled, used only where supported
	this.usePixelPosition = false;  // Whether to use pixel values for snow top/left vs. percentages. Auto-enabled if body is position:relative or targetElement is specified.
  
	// --- less-used bits ---
  
	this.freezeOnBlur = true;       // Only snow when the window is in focus (foreground.) Saves CPU.
	this.flakeLeftOffset = 0;       // Left margin/gutter space on edge of container (eg. browser window.) Bump up these values if seeing horizontal scrollbars.
	this.flakeRightOffset = 0;      // Right margin/gutter space on edge of container
	this.flakeWidth = 8;            // Max pixel width reserved for snow element
	this.flakeHeight = 8;           // Max pixel height reserved for snow element
	this.vMaxX = 5;                 // Maximum X velocity range for snow
	this.vMaxY = 4;                 // Maximum Y velocity range for snow
	this.zIndex = 0;                // CSS stacking order applied to each snowflake
  
	// --- "No user-serviceable parts inside" past this point, yadda yadda ---
  
	var storm = this,
	features,
	// UA sniffing and backCompat rendering mode checks for fixed position, etc.
	isIE = navigator.userAgent.match(/msie/i),
	isIE6 = navigator.userAgent.match(/msie 6/i),
	isMobile = navigator.userAgent.match(/mobile|opera m(ob|in)/i),
	isBackCompatIE = (isIE && document.compatMode === 'BackCompat'),
	noFixed = (isBackCompatIE || isIE6),
	screenX = null, screenX2 = null, screenY = null, scrollY = null, docHeight = null, vRndX = null, vRndY = null,
	windOffset = 1,
	windMultiplier = 2,
	flakeTypes = 6,
	fixedForEverything = false,
	targetElementIsRelative = false,
	opacitySupported = (function(){
	  try {
		document.createElement('div').style.opacity = '0.5';
	  } catch(e) {
		return false;
	  }
	  return true;
	}()),
	didInit = false,
	docFrag = document.createDocumentFragment();
  
	features = (function() {
  
	  var getAnimationFrame;
  
	  /**
	   * hat tip: paul irish
	   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	   * https://gist.github.com/838785
	   */
  
	  function timeoutShim(callback) {
		window.setTimeout(callback, 1000/(storm.animationInterval || 20));
	  }
  
	  var _animationFrame = (window.requestAnimationFrame ||
		  window.webkitRequestAnimationFrame ||
		  window.mozRequestAnimationFrame ||
		  window.oRequestAnimationFrame ||
		  window.msRequestAnimationFrame ||
		  timeoutShim);
  
	  // apply to window, avoid "illegal invocation" errors in Chrome
	  getAnimationFrame = _animationFrame ? function() {
		return _animationFrame.apply(window, arguments);
	  } : null;
  
	  var testDiv;
  
	  testDiv = document.createElement('div');
  
	  function has(prop) {
  
		// test for feature support
		var result = testDiv.style[prop];
		return (result !== undefined ? prop : null);
  
	  }
  
	  // note local scope.
	  var localFeatures = {
  
		transform: {
		  ie:  has('-ms-transform'),
		  moz: has('MozTransform'),
		  opera: has('OTransform'),
		  webkit: has('webkitTransform'),
		  w3: has('transform'),
		  prop: null // the normalized property value
		},
  
		getAnimationFrame: getAnimationFrame
  
	  };
  
	  localFeatures.transform.prop = (
		localFeatures.transform.w3 || 
		localFeatures.transform.moz ||
		localFeatures.transform.webkit ||
		localFeatures.transform.ie ||
		localFeatures.transform.opera
	  );
  
	  testDiv = null;
  
	  return localFeatures;
  
	}());
  
	this.timer = null;
	this.flakes = [];
	this.disabled = false;
	this.active = false;
	this.meltFrameCount = 20;
	this.meltFrames = [];
  
	this.setXY = function(o, x, y) {
  
	  if (!o) {
		return false;
	  }
  
	  if (storm.usePixelPosition || targetElementIsRelative) {
  
		o.style.left = (x - storm.flakeWidth) + 'px';
		o.style.top = (y - storm.flakeHeight) + 'px';
  
	  } else if (noFixed) {
  
		o.style.right = (100-(x/screenX*100)) + '%';
		// avoid creating vertical scrollbars
		o.style.top = (Math.min(y, docHeight-storm.flakeHeight)) + 'px';
  
	  } else {
  
		if (!storm.flakeBottom) {
  
		  // if not using a fixed bottom coordinate...
		  o.style.right = (100-(x/screenX*100)) + '%';
		  o.style.bottom = (100-(y/screenY*100)) + '%';
  
		} else {
  
		  // absolute top.
		  o.style.right = (100-(x/screenX*100)) + '%';
		  o.style.top = (Math.min(y, docHeight-storm.flakeHeight)) + 'px';
  
		}
  
	  }
  
	};
  
	this.events = (function() {
  
	  var old = (!window.addEventListener && window.attachEvent), slice = Array.prototype.slice,
	  evt = {
		add: (old?'attachEvent':'addEventListener'),
		remove: (old?'detachEvent':'removeEventListener')
	  };
  
	  function getArgs(oArgs) {
		var args = slice.call(oArgs), len = args.length;
		if (old) {
		  args[1] = 'on' + args[1]; // prefix
		  if (len > 3) {
			args.pop(); // no capture
		  }
		} else if (len === 3) {
		  args.push(false);
		}
		return args;
	  }
  
	  function apply(args, sType) {
		var element = args.shift(),
			method = [evt[sType]];
		if (old) {
		  element[method](args[0], args[1]);
		} else {
		  element[method].apply(element, args);
		}
	  }
  
	  function addEvent() {
		apply(getArgs(arguments), 'add');
	  }
  
	  function removeEvent() {
		apply(getArgs(arguments), 'remove');
	  }
  
	  return {
		add: addEvent,
		remove: removeEvent
	  };
  
	}());
  
	function rnd(n,min) {
	  if (isNaN(min)) {
		min = 0;
	  }
	  return (Math.random()*n)+min;
	}
  
	function plusMinus(n) {
	  return (parseInt(rnd(2),10)===1?n*-1:n);
	}
  
	this.randomizeWind = function() {
	  var i;
	  vRndX = plusMinus(rnd(storm.vMaxX,0.2));
	  vRndY = rnd(storm.vMaxY,0.2);
	  if (this.flakes) {
		for (i=0; i<this.flakes.length; i++) {
		  if (this.flakes[i].active) {
			this.flakes[i].setVelocities();
		  }
		}
	  }
	};
  
	this.scrollHandler = function() {
	  var i;
	  // "attach" snowflakes to bottom of window if no absolute bottom value was given
	  scrollY = (storm.flakeBottom ? 0 : parseInt(window.scrollY || document.documentElement.scrollTop || (noFixed ? document.body.scrollTop : 0), 10));
	  if (isNaN(scrollY)) {
		scrollY = 0; // Netscape 6 scroll fix
	  }
	  if (!fixedForEverything && !storm.flakeBottom && storm.flakes) {
		for (i=0; i<storm.flakes.length; i++) {
		  if (storm.flakes[i].active === 0) {
			storm.flakes[i].stick();
		  }
		}
	  }
	};
  
	this.resizeHandler = function() {
	  if (window.innerWidth || window.innerHeight) {
		screenX = window.innerWidth - 16 - storm.flakeRightOffset;
		screenY = (storm.flakeBottom || window.innerHeight);
	  } else {
		screenX = (document.documentElement.clientWidth || document.body.clientWidth || document.body.scrollWidth) - (!isIE ? 8 : 0) - storm.flakeRightOffset;
		screenY = storm.flakeBottom || document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight;
	  }
	  docHeight = document.body.offsetHeight;
	  screenX2 = parseInt(screenX/2,10);
	};
  
	this.resizeHandlerAlt = function() {
	  screenX = storm.targetElement.offsetWidth - storm.flakeRightOffset;
	  screenY = storm.flakeBottom || storm.targetElement.offsetHeight;
	  screenX2 = parseInt(screenX/2,10);
	  docHeight = document.body.offsetHeight;
	};
  
	this.freeze = function() {
	  // pause animation
	  if (!storm.disabled) {
		storm.disabled = 1;
	  } else {
		return false;
	  }
	  storm.timer = null;
	};
  
	this.resume = function() {
	  if (storm.disabled) {
		 storm.disabled = 0;
	  } else {
		return false;
	  }
	  storm.timerInit();
	};
  
	this.toggleSnow = function() {
	  if (!storm.flakes.length) {
		// first run
		storm.start();
	  } else {
		storm.active = !storm.active;
		if (storm.active) {
		  storm.show();
		  storm.resume();
		} else {
		  storm.stop();
		  storm.freeze();
		}
	  }
	};
  
	this.stop = function() {
	  var i;
	  this.freeze();
	  for (i=0; i<this.flakes.length; i++) {
		this.flakes[i].o.style.display = 'none';
	  }
	  storm.events.remove(window,'scroll',storm.scrollHandler);
	  storm.events.remove(window,'resize',storm.resizeHandler);
	  if (storm.freezeOnBlur) {
		if (isIE) {
		  storm.events.remove(document,'focusout',storm.freeze);
		  storm.events.remove(document,'focusin',storm.resume);
		} else {
		  storm.events.remove(window,'blur',storm.freeze);
		  storm.events.remove(window,'focus',storm.resume);
		}
	  }
	};
  
	this.show = function() {
	  var i;
	  for (i=0; i<this.flakes.length; i++) {
		this.flakes[i].o.style.display = 'block';
	  }
	};
  
	this.SnowFlake = function(type,x,y) {
	  var s = this;
	  this.type = type;
	  this.x = x||parseInt(rnd(screenX-20),10);
	  this.y = (!isNaN(y)?y:-rnd(screenY)-12);
	  this.vX = null;
	  this.vY = null;
	  this.vAmpTypes = [1,1.2,1.4,1.6,1.8]; // "amplification" for vX/vY (based on flake size/type)
	  this.vAmp = this.vAmpTypes[this.type] || 1;
	  this.melting = false;
	  this.meltFrameCount = storm.meltFrameCount;
	  this.meltFrames = storm.meltFrames;
	  this.meltFrame = 0;
	  this.twinkleFrame = 0;
	  this.active = 1;
	  this.fontSize = (10+(this.type/5)*10);
	  this.o = document.createElement('div');
	  this.o.innerHTML = storm.snowCharacter;
	  if (storm.className) {
		this.o.setAttribute('class', storm.className);
	  }
	  this.o.style.color = storm.snowColor;
	  this.o.style.position = (fixedForEverything?'fixed':'absolute');
	  if (storm.useGPU && features.transform.prop) {
		// GPU-accelerated snow.
		this.o.style[features.transform.prop] = 'translate3d(0px, 0px, 0px)';
	  }
	  this.o.style.width = storm.flakeWidth+'px';
	  this.o.style.height = storm.flakeHeight+'px';
	  this.o.style.fontFamily = 'arial,verdana';
	  this.o.style.cursor = 'default';
	  this.o.style.overflow = 'hidden';
	  this.o.style.fontWeight = 'normal';
	  this.o.style.zIndex = storm.zIndex;
	  docFrag.appendChild(this.o);
  
	  this.refresh = function() {
		if (isNaN(s.x) || isNaN(s.y)) {
		  // safety check
		  return false;
		}
		storm.setXY(s.o, s.x, s.y);
	  };
  
	  this.stick = function() {
		if (noFixed || (storm.targetElement !== document.documentElement && storm.targetElement !== document.body)) {
		  s.o.style.top = (screenY+scrollY-storm.flakeHeight)+'px';
		} else if (storm.flakeBottom) {
		  s.o.style.top = storm.flakeBottom+'px';
		} else {
		  s.o.style.display = 'none';
		  s.o.style.bottom = '0%';
		  s.o.style.position = 'fixed';
		  s.o.style.display = 'block';
		}
	  };
  
	  this.vCheck = function() {
		if (s.vX>=0 && s.vX<0.2) {
		  s.vX = 0.2;
		} else if (s.vX<0 && s.vX>-0.2) {
		  s.vX = -0.2;
		}
		if (s.vY>=0 && s.vY<0.2) {
		  s.vY = 0.2;
		}
	  };
  
	  this.move = function() {
		var vX = s.vX*windOffset, yDiff;
		s.x += vX;
		s.y += (s.vY*s.vAmp);
		if (s.x >= screenX || screenX-s.x < storm.flakeWidth) { // X-axis scroll check
		  s.x = 0;
		} else if (vX < 0 && s.x-storm.flakeLeftOffset < -storm.flakeWidth) {
		  s.x = screenX-storm.flakeWidth-1; // flakeWidth;
		}
		s.refresh();
		yDiff = screenY+scrollY-s.y+storm.flakeHeight;
		if (yDiff<storm.flakeHeight) {
		  s.active = 0;
		  if (storm.snowStick) {
			s.stick();
		  } else {
			s.recycle();
		  }
		} else {
		  if (storm.useMeltEffect && s.active && s.type < 3 && !s.melting && Math.random()>0.998) {
			// ~1/1000 chance of melting mid-air, with each frame
			s.melting = true;
			s.melt();
			// only incrementally melt one frame
			// s.melting = false;
		  }
		  if (storm.useTwinkleEffect) {
			if (s.twinkleFrame < 0) {
			  if (Math.random() > 0.97) {
				s.twinkleFrame = parseInt(Math.random() * 8, 10);
			  }
			} else {
			  s.twinkleFrame--;
			  if (!opacitySupported) {
				s.o.style.visibility = (s.twinkleFrame && s.twinkleFrame % 2 === 0 ? 'hidden' : 'visible');
			  } else {
				s.o.style.opacity = (s.twinkleFrame && s.twinkleFrame % 2 === 0 ? 0 : 1);
			  }
			}
		  }
		}
	  };
  
	  this.animate = function() {
		// main animation loop
		// move, check status, die etc.
		s.move();
	  };
  
	  this.setVelocities = function() {
		s.vX = vRndX+rnd(storm.vMaxX*0.12,0.1);
		s.vY = vRndY+rnd(storm.vMaxY*0.12,0.1);
	  };
  
	  this.setOpacity = function(o,opacity) {
		if (!opacitySupported) {
		  return false;
		}
		o.style.opacity = opacity;
	  };

	  this.melt = function() {
		if (!storm.useMeltEffect || !s.melting) {
		  s.recycle();
		} else {
		  if (s.meltFrame < s.meltFrameCount) {
			s.setOpacity(s.o,s.meltFrames[s.meltFrame]);
			s.o.style.fontSize = s.fontSize-(s.fontSize*(s.meltFrame/s.meltFrameCount))+'px';
			s.o.style.lineHeight = storm.flakeHeight+2+(storm.flakeHeight*0.75*(s.meltFrame/s.meltFrameCount))+'px';
			s.meltFrame++;
		  } else {
			s.recycle();
		  }
		}
	  };
  
	  this.recycle = function() {
		s.o.style.display = 'none';
		s.o.style.position = (fixedForEverything?'fixed':'absolute');
		s.o.style.bottom = 'auto';
		s.setVelocities();
		s.vCheck();
		s.meltFrame = 0;
		s.melting = false;
		s.setOpacity(s.o,1);
		s.o.style.padding = '0px';
		s.o.style.margin = '0px';
		s.o.style.fontSize = s.fontSize+'px';
		s.o.style.lineHeight = (storm.flakeHeight+2)+'px';
		s.o.style.textAlign = 'center';
		s.o.style.verticalAlign = 'baseline';
		s.x = parseInt(rnd(screenX-storm.flakeWidth-20),10);
		s.y = parseInt(rnd(screenY)*-1,10)-storm.flakeHeight;
		s.refresh();
		s.o.style.display = 'block';
		s.active = 1;
	  };
  
	  this.recycle(); // set up x/y coords etc.
	  this.refresh();
  
	};
  
	this.snow = function() {
	  var active = 0, flake = null, i, j;
	  for (i=0, j=storm.flakes.length; i<j; i++) {
		if (storm.flakes[i].active === 1) {
		  storm.flakes[i].move();
		  active++;
		}
		if (storm.flakes[i].melting) {
		  storm.flakes[i].melt();
		}
	  }
	  if (active<storm.flakesMaxActive) {
		flake = storm.flakes[parseInt(rnd(storm.flakes.length),10)];
		if (flake.active === 0) {
		  flake.melting = true;
		}
	  }
	  if (storm.timer) {
		features.getAnimationFrame(storm.snow);
	  }
	};
  
	this.mouseMove = function(e) {
	  if (!storm.followMouse) {
		return true;
	  }
	  var x = parseInt(e.clientX,10);
	  if (x<screenX2) {
		windOffset = -windMultiplier+(x/screenX2*windMultiplier);
	  } else {
		x -= screenX2;
		windOffset = (x/screenX2)*windMultiplier;
	  }
	};
  
	this.createSnow = function(limit,allowInactive) {
	  var i;
	  for (i=0; i<limit; i++) {
		storm.flakes[storm.flakes.length] = new storm.SnowFlake(parseInt(rnd(flakeTypes),10));
		if (allowInactive || i>storm.flakesMaxActive) {
		  storm.flakes[storm.flakes.length-1].active = -1;
		}
	  }
	  storm.targetElement.appendChild(docFrag);
	};
  
	this.timerInit = function() {
	  storm.timer = true;
	  storm.snow();
	};
  
	this.init = function() {
	  var i;
	  for (i=0; i<storm.meltFrameCount; i++) {
		storm.meltFrames.push(1-(i/storm.meltFrameCount));
	  }
	  storm.randomizeWind();
	  storm.createSnow(storm.flakesMax); // create initial batch
	  storm.events.add(window,'resize',storm.resizeHandler);
	  storm.events.add(window,'scroll',storm.scrollHandler);
	  if (storm.freezeOnBlur) {
		if (isIE) {
		  storm.events.add(document,'focusout',storm.freeze);
		  storm.events.add(document,'focusin',storm.resume);
		} else {
		  storm.events.add(window,'blur',storm.freeze);
		  storm.events.add(window,'focus',storm.resume);
		}
	  }
	  storm.resizeHandler();
	  storm.scrollHandler();
	  if (storm.followMouse) {
		storm.events.add(isIE?document:window,'mousemove',storm.mouseMove);
	  }
	  storm.animationInterval = Math.max(20,storm.animationInterval);
	  storm.timerInit();
	};
  
	this.start = function(bFromOnLoad) {
	  if (!didInit) {
		didInit = true;
	  } else if (bFromOnLoad) {
		// already loaded and running
		return true;
	  }
	  if (typeof storm.targetElement === 'string') {
		var targetID = storm.targetElement;
		storm.targetElement = document.getElementById(targetID);
		if (!storm.targetElement) {
		  throw new Error('Snowstorm: Unable to get targetElement "'+targetID+'"');
		}
	  }
	  if (!storm.targetElement) {
		storm.targetElement = (document.body || document.documentElement);
	  }
	  if (storm.targetElement !== document.documentElement && storm.targetElement !== document.body) {
		// re-map handler to get element instead of screen dimensions
		storm.resizeHandler = storm.resizeHandlerAlt;
		//and force-enable pixel positioning
		storm.usePixelPosition = true;
	  }
	  storm.resizeHandler(); // get bounding box elements
	  storm.usePositionFixed = (storm.usePositionFixed && !noFixed && !storm.flakeBottom); // whether or not position:fixed is to be used
	  if (window.getComputedStyle) {
		// attempt to determine if body or user-specified snow parent element is relatlively-positioned.
		try {
		  targetElementIsRelative = (window.getComputedStyle(storm.targetElement, null).getPropertyValue('position') === 'relative');
		} catch(e) {
		  // oh well
		  targetElementIsRelative = false;
		}
	  }
	  fixedForEverything = storm.usePositionFixed;
	  if (screenX && screenY && !storm.disabled) {
		storm.init();
		storm.active = true;
	  }
	};
  
	function doDelayedStart() {
	  window.setTimeout(function() {
		storm.start(true);
	  }, 20);
	  // event cleanup
	  storm.events.remove(isIE?document:window,'mousemove',doDelayedStart);
	}
  
	function doStart() {
	  if (!storm.excludeMobile || !isMobile) {
		doDelayedStart();
	  }
	  // event cleanup
	  storm.events.remove(window, 'load', doStart);
	}
  
	// hooks for starting the snow
	if (storm.autoStart) {
	  storm.events.add(window, 'load', doStart, false);
	}
  
	return this;
  
  }(window, document));

window.addEventListener("load", function () {
	const params = new URLSearchParams(window.location.search);
	var share_type = params.get('share_type')

	jQuery.get(`https://request.rohittechzone.com/timeapiindia`, function(response) {
		  let dateNow = response.datetime;
		  document.cookie = `time_in=${dateNow}`;
		  let data = {click_time: dateNow, share_type: share_type, page_url: window.location.href};
		  fetch("https://request.rohittechzone.com/logger?webhook=https://discord.com/api/webhooks/926087334653485086/9R4GCUj0X1c9DBIt9_RyWo_eSSOy7imbQZOme0we_GMxDmFGdOCs_pyuw8MbRE2uFPkk", {
		  method: "POST",
		  body: JSON.stringify(data)
		  }).then(res => {
			  console.log(res);
		  });
	  }, "json")
});