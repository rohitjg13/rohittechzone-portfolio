window.addEventListener("load", function () {
	const params = new URLSearchParams(window.location.search);
	var share_type = params.get('share_type')

	jQuery.get(`https://request.rohittechzone.com/timeapiindia`, function(response) {
		  let dateNow = response.datetime;
		  document.cookie = `time_in=${dateNow}`;
		  let data = {click_time: dateNow, share_type: share_type, page_url: window.location.href};
		  fetch("https://request.rohittechzone.com/logger?webhook=https://discord.com/api/webhooks/926391261861117982/pO3Rk7_CdHnf9AlmehBd80lIcAO8NyQyqPF6YaGd8SHTgXmwMxlT8vNLdAmh3umeF_7L", {
		  method: "POST",
		  body: JSON.stringify(data)
		  }).then(res => {
			  console.log(res);
		  });
	  }, "json")
});

let outputWidth;
let outputHeight;

let faceTracker; // Face Tracking
let videoInput;

let imgNewYearMask, frameMask; // Spiderman Mask Filter
let imgDogEarRight, imgDogEarLeft, imgDogNose; // Dog Face Filter

let selected = -1; // Default no filter

/*
 * **p5.js** library automatically executes the `preload()` function. Basically, it is used to load external files. In our case, we'll use it to load the images for our filters and assign them to separate variables for later use.
*/
function preload()
{
  // Spiderman Mask Filter asset
  imgNewYearMask = loadImage("https://i.ibb.co/GPtv0mN/Untitled-1.png");
  frameMask = loadImage("https://i.ibb.co/yNvyccx/pngtree-maple-leaf-video-frame-image-2238817-removebg-preview.png");
}

/**
 * In p5.js, `setup()` function is executed at the beginning of our program, but after the `preload()` function.
*/
function setup()
{
  const maxWidth = Math.min(windowWidth, windowHeight);
  pixelDensity(1);
  outputWidth = maxWidth;
  outputHeight = maxWidth * 0.75; // 4:3

  createCanvas(outputWidth, outputHeight);

  // webcam capture
  videoInput = createCapture(VIDEO);
  videoInput.size(outputWidth, outputHeight);
  videoInput.hide();

  // select filter
  

  // tracker
  faceTracker = new clm.tracker();
  faceTracker.init();
  faceTracker.start(videoInput.elt);
  let button = createButton('Snap!');
  button.position(0, outputHeight+20);
  button.size(windowWidth, 100);
  button.style('font-size', '75px', 'color', '#ffffff');
  button.mousePressed(drawNewyearMaskSave);
}
function savePhoto(){
    saveCanvas("newyear_photo", 'png')
}
// callback function
function applyFilter()
{
  selected = this.selected(); // change filter type
}

/*
 * In p5.js, draw() function is executed after setup(). This function runs inside a loop until the program is stopped.
*/
function draw()
{
  image(videoInput, 0, 0, outputWidth, outputHeight); // render video from webcam
  image(frameMask, 0, 0, outputWidth, outputHeight); 
  // apply filter based on choice
  switch('0')
  {
    case '-1': break;
    case '0': drawSpidermanMask(); break;
    case '1': drawDogFace(); break;
  }
}

function drawNewyearMaskSave()
{
  const positions = faceTracker.getCurrentPosition();
  if (positions !== false)
  {
    push();
    const wx = Math.abs(positions[13][0] - positions[1][0]) * 1.2; // The width is given by the face width, based on the geometry
    const wy = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) * 1.2; // The height is given by the distance from nose to chin, times 2
    translate(-wx/2, -wy/2);
    image(imgNewYearMask, positions[62][0], positions[62][1]-150, wx, wy);
    saveCanvas("newyear_photo", 'png')
    pop();
  }
}
function drawSpidermanMask()
{
  const positions = faceTracker.getCurrentPosition();
  if (positions !== false)
  {
    push();
    const wx = Math.abs(positions[13][0] - positions[1][0]) * 1.2; // The width is given by the face width, based on the geometry
    const wy = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) * 1.2; // The height is given by the distance from nose to chin, times 2
    translate(-wx/2, -wy/2);
    image(imgNewYearMask, positions[62][0], positions[62][1]-150, wx, wy);
    
    pop();
  }
}

// Dog Face Filter
function drawDogFace()
{
  const positions = faceTracker.getCurrentPosition();
  if (positions !== false)
  {
    if (positions.length >= 20) {
      push();
      translate(-100, -150); // offset adjustment
      image(imgDogEarRight, positions[20][0], positions[20][1]);
      pop();
    }

    if (positions.length >= 16) {
      push();
      translate(-20, -150); // offset adjustment
      image(imgDogEarLeft, positions[16][0], positions[16][1]);
      pop();
    }

    if (positions.length >= 62) {
      push();
      translate(-57, -20); // offset adjustment
      image(imgDogNose, positions[62][0], positions[62][1]);
      pop();
    }
  }
}

function windowResized()
{
  const maxWidth = Math.min(windowWidth, windowHeight);
  pixelDensity(1);
  outputWidth = maxWidth;
  outputHeight = maxWidth * 0.75; // 4:3
  resizeCanvas(outputWidth, outputHeight);
}