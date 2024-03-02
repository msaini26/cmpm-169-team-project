//  ==== NOTES ====
//  - for water detection,...
//    - inWater would go by true or false instead
//    - collision function instead of keypress
//    -Collision code between circle and rectangle

let x;
let y;
let yspeed;

let fallMult;
let bouyantMult;
let currMult;
let inWater;

var cir;
var sqr;

var radius;
var sqrWidth;
var sqrHeight;

let sound;
let bubbles = [];

function preload(){
  sound = loadSound('assets/water_plop.wav');
}

function setup() {
 
  createCanvas(400, 400);
  x = width/2
  y = height/2
 
  fallMult = 1.01;
  bouyantMult = 0.99;
  currMult = fallMult;
  inWater = -1;
 
  yspeed = 0;
 
  radius = 50;
  sqrWidth = 400;
  sqrHeight = 200;
  
  // Create bubbles
  for (let i = 0; i < 25; i++) {
    bubbles.push(new Bubble());
  }
 
}

function draw() {
 
  // Water Color
  background(0, 150, 255);
  
  // Draw bubbles
  for (let bubble of bubbles) {
    bubble.display();
    bubble.ascend();
    bubble.update();
  }  
  sqr = rect(0, 200, sqrWidth, sqrHeight);

  collisionDetection(); // check for collision with water
 
  ellipse(x, y, 50, 50);    // draw the circle
 
  // BOUYANCY -- floats up if in water, falls down if not
  if (inWater == -1) {currMult = fallMult;}
  else if (inWater == 1) {currMult = bouyantMult;}
 
  // GRAVITY
  yspeed += (currMult - 1) * deltaTime;
  y+=yspeed;
 
  // BOUNCING
  if (y > height) {
   
      y = height;
      yspeed *= -0.7;
   
  }
 
}

function collisionDetection(){ // check for collision with "water"
  var collide = (y > sqrHeight - radius/2);
  if (collide && !sound.isPlaying()) { // if colliding with water : inWater = true
    console.log("Collision");
    inWater = true;
    //sound.play();
  } else {
    inWater = false;
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
// function keyPressed() {
 
//   if (key == ' ') {
   
//     inWater *= -1;
   
//   }
 
//   // if colliding with water : inWater = true
//   // else if NOT colliding with water : inWater = false
//   if((y + radius / 2) > sqrHeight){
//     console.log("Collision")
//     inWater = true;
//   }else{
//     inWater = false;
//   }
// }
