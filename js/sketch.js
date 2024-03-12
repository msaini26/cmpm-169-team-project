//  ==== NOTES ====
//  - for water detection,...
//    - inWater would go by true or false instead
//    - collision function instead of keypress
//    -Collision code between circle and rectangle


let video;
let guyPosition;
let camActive = false;

let x;
let y;
let yspeed;

let gravity;
let fallMult;
let bouyantMult;
let currMult;
let inWater;

var cir;
var sqr;

var radius;
var sqrWidth;
var sqrHeight;

var isEmpty = true;
var isFull = false;
var addPressed = false;
var drainPressed = false;
var fillHeight = 0;

let sound;
let bubbles = [];

let floaties = [];

function preload() {

  sound = loadSound("../assets/plop.wav");
  font = loadFont('../js/Mogent.otf');

}

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(600, 600);
  canvas.parent("canvas-container");

  // createCanvas(600, 600);
  x = width / 2;
  y = height / 2;

  gravity = 0.3;
  fallMult = 0.1;
  bouyantMult = -0.1;
  currMult = fallMult;
  inWater = -1;

  yspeed = 0;

  radius = 50;
  sqrWidth = 400;
  sqrHeight = 200;



  let toggleCamera = createButton("Toggle Camera");
  toggleCamera.position(835, 195);
  toggleCamera.mousePressed(toggleCamera);

  guyPosition = createVector(width / 2, height / 2);


  // Create bubbles
  for (let i = 0; i < 25; i++) {
    bubbles.push(new Bubble());
  }

  //add water button
  let addButton = createButton("add water");
  addButton.position(835, 135);

  addButton.mousePressed(() => {
    if (isEmpty) {
      addPressed = true;
    }
  });

  //drain water button
  let drainButton = createButton("drain water");
  drainButton.position(835, 165);

  drainButton.mousePressed(() => {
    if (isFull) {
      drainPressed = true;
    }
  });

  floaties = [];

}

function draw() {

  if (camActive) {
    // Display the webcam feed
    image(video, 0, 0, width, height);

    // Shake the little guy in place
    let shakeX = random(-40, 40);
    let shakeY = random(-30, 30);
    guyPosition.add(createVector(shakeX, shakeY));

    // Move the little guy smoothly
    guyPosition.add(p5.Vector.random2D().mult(2));

    // Keep the little guy within the canvas bounds
    guyPosition.x = constrain(guyPosition.x, 0, width);
    guyPosition.y = constrain(guyPosition.y, 0, height);
  }

  // Draw the little guy
  fill(255, 0, 0);
  rectMode(CENTER);
  rect(guyPosition.x, guyPosition.y, 50, 50);

  // Start the audio context on a click/touch event to prevent it from being blocked by browsers
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }

  // Water Color
  // background(0, 150, 255);
  background(255);

  
  // draw water #2
  fill(0, 100, 200); //water color
  beginShape();
  for (let x = 0; x <= width; x += 20) {
    let y = 600 - fillHeight + sin(x * 0.02 + frameCount * 0.01) * 50;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  //draw water
  fill(0, 150, 255); //water color
  beginShape();
  for (let x = 0; x <= width; x += 10) {
    let y = 600 - fillHeight + sin(x * 0.02 + frameCount * 0.05) * 50;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);


  //fill with water
  if (isEmpty && addPressed && fillHeight <= 600) {
    fillHeight += 5;
  }
  if (fillHeight >= 500) {
    isFull = true;
    isEmpty = false;
    addPressed = false;
  }

  //drain the water
  if (isFull && drainPressed && fillHeight >= 0) {
    fillHeight -= 5;
  }
  if (fillHeight <= 0) {
    isFull = false;
    isEmpty = true;
    drainPressed = false;
  }

  // Draw bubbles
  for (let bubble of bubbles) {
    bubble.display();
    bubble.ascend();
    bubble.update();
  }
  // sqr = rect(0, 0, sqrWidth, sqrHeight);

  for (i = 0; i < floaties.length; i++) {

    floaties[i].Update();

    if (floaties[i].y > height + 10) {

      floaties.splice(i, 1)

    }

  }

}

function toggleCamera() {
  if (!camActive) {
    // Activate the camera
    video = createCapture(VIDEO);
    video.size(300, 300);
    video.hide();
    camActive = true;
  } else {
    // Deactivate the camera
    video.stop();
    camActive = false;
    // Reset the little guy's position to the center
    guyPosition = createVector(width / 2, height / 2);
  }
}

function keyPressed() {

  console.log(keyCode);

  let newLetter = new floaty(0.05, -0.05, 0.4, mouseX, -25, key);
  floaties.push(newLetter);

}

// ===== CLASSES =====
class floaty {

  constructor(fall, bouyancy, bounciness, x, y, letter) {

    this.letter = letter;
    this.fallMult = fall;
    this.bouyantMult = bouyancy;
    this.bounciness = bounciness;
    this.currMult = this.fall;
    this.yspeed = 0;
    this.inWater = false;
    this.x = x;
    this.y = y;

  }

  DrawMe() {

    fill(51)
    //ellipse(this.x, this.y, 50, 50); // draw the circle
    textSize(50);
    text(this.letter, this.x, this.y);

  }

  CollisionDetection() {

    var collide = -fillHeight + 600 < this.y;
    if (collide) {

      if (!this.inWater) { console.log("COLLIDED"); }
      
      if(!sound.isPlaying() && !this.inWater && this.yspeed > 3) {sound.play()};
      this.inWater = true;

    } else {

      this.inWater = false;

    }

  }

  Update() {

    this.CollisionDetection(); // check for collision with water

    // BOUYANCY -- floats up if in water, falls down if not
    if (this.inWater == false) {
      this.currMult = this.fallMult;
    } else if (this.inWater == true) {
      this.currMult = this.bouyantMult;
    }

    // GRAVITY
    this.yspeed += gravity * this.currMult * deltaTime;
    this.y += this.yspeed;

    /*// BOUNCING
    if (this.y > height) {
      this.y = height;
      this.yspeed *= -this.bounciness;
    }*/

    this.DrawMe();

  }

}


// Bubble class
class Bubble {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.diameter = random(5, 20);
    this.speed = random(0.5, 2);
  }

  ascend() {
    this.y -= this.speed;
    if (this.y < -this.diameter) {
      this.y = height + this.diameter;
    }
  }

  update() {
    // Reset bubble position when it reaches top
    if (this.y < 0) {
      this.x = random(width);
      this.y = height + this.diameter;
    }
  }

  display() {
    noStroke();
    fill(255); // White bubbles
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}
