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

let henry;

let particles = [];

let fish = [];

let duck;

let person;
var personAdded = false;

function preload() {
  sound = loadSound("../assets/plop.wav");
  font = loadFont("../js/Mogent.otf");
  duck = loadImage("../assets/duck.png");
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

  // Set up camera
  video = createCapture(VIDEO);
  video.size(100, 100);
  video.hide();

  // Toggle camera button
  // let cameraButton = createButton("Toggle Camera");
  // cameraButton.position(835, 195);
  // cameraButton.mousePressed(toggleCamera);

  // guyPosition = createVector(width / 2, height / 2);

  // Create bubbles
  for (let i = 0; i < 25; i++) {
    bubbles.push(new Bubble());
  }

  // add water button
  let addButton = createButton("add water");
  addButton.position(1020, 170);

  // button styling for add water
  addButton.style("background-color", "#3f51b5");
  addButton.style("color", "white");
  addButton.style("font-family", "sans-serif");
  addButton.style("font-size", "16px");
  addButton.style("font-weight", "bold");
  addButton.style("padding", "15px 30px");
  addButton.style("border", "none");
  addButton.style("border-radius", "5px");
  addButton.style("cursor", "pointer");
  addButton.style("box-shadow", "0px 3px 5px rgba(0, 0, 0, 0.2)");
  addButton.style("transition", "all 0.2s ease-in-out");

  // add hover effects for add water button
  addButton.mouseOver(() => {
    addButton.style("background-color", "#28377d");
    addButton.style("box-shadow", "0px 5px 10px rgba(0, 0, 0, 0.4)");
  });

  addButton.mouseOut(() => {
    addButton.style("background-color", "#3f51b5");
    addButton.style("box-shadow", "0px 3px 5px rgba(0, 0, 0, 0.2)");
  });

  addButton.mousePressed(() => {
    if (isEmpty) {
      addPressed = true;
    }
  });

  //drain water button
  let drainButton = createButton("drain water");
  drainButton.position(1020, 230);

  // button styling for drain water
  drainButton.style("background-color", "#3f51b5");
  drainButton.style("color", "white");
  drainButton.style("font-family", "sans-serif");
  drainButton.style("font-size", "16px");
  drainButton.style("font-weight", "bold");
  drainButton.style("padding", "15px 30px");
  drainButton.style("border", "none");
  drainButton.style("border-radius", "5px");
  drainButton.style("cursor", "pointer");
  drainButton.style("box-shadow", "0px 3px 5px rgba(0, 0, 0, 0.2)");
  drainButton.style("transition", "all 0.2s ease-in-out");

  // hover effect for draining water
  drainButton.mouseOver(() => {
    drainButton.style("background-color", "#28377d"); // Darker background on hover
    drainButton.style("box-shadow", "0px 5px 10px rgba(0, 0, 0, 0.4)"); // More prominent shadow
  });

  drainButton.mouseOut(() => {
    drainButton.style("background-color", "#3f51b5");
    drainButton.style("box-shadow", "0px 3px 5px rgba(0, 0, 0, 0.2)");
  });

  drainButton.mousePressed(() => {
    if (isFull) {
      drainPressed = true;
    }
  });

  //add person button
  let personButton = createButton("add person");
  personButton.position(1020, 290);

  personButton.style("background-color", "#3f51b5");
  personButton.style("color", "white");
  personButton.style("font-family", "sans-serif");
  personButton.style("font-size", "16px");
  personButton.style("font-weight", "bold");
  personButton.style("padding", "15px 30px");
  personButton.style("border", "none");
  personButton.style("border-radius", "5px");
  personButton.style("cursor", "pointer");
  personButton.style("box-shadow", "0px 3px 5px rgba(0, 0, 0, 0.2)");
  personButton.style("transition", "all 0.2s ease-in-out");

  // Hover effect for person button
  personButton.mouseOver(() => {
    personButton.style("background-color", "#28377d"); // Darker background on hover
    personButton.style("box-shadow", "0px 5px 10px rgba(0, 0, 0, 0.4)"); // More prominent shadow
  });

  personButton.mouseOut(() => {
    personButton.style("background-color", "#3f51b5");
    personButton.style("box-shadow", "0px 3px 5px rgba(0, 0, 0, 0.2)");
  });

  personButton.mousePressed(() => {
    if (!personAdded) {
      person = new Person(0.025, -0.03, 0.2, 100, -100); //(fall, bouyancy, bounciness, x, y)
      person.setup();
      personAdded = true;
    }
  });

  floaties = [];

  // Create fish
  for (let i = 0; i < 5; i++) {
    fish.push(new Fish());
  }

  henry = new ducky(0.02, -0.01, 0.4, 300, 150);

  // person = new Person(0.025, -0.03, 0.2, 100, 100); //(fall, bouyancy, bounciness, x, y)
  // person.setup();
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
  // fill(255, 0, 0);
  // rectMode(CENTER);
  // rect(guyPosition.x, guyPosition.y, 50, 50);

  // Start the audio context on a click/touch event to prevent it from being blocked by browsers
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }

  // Water Color
  // background(0, 150, 255);
  background(255);

  // draw water #2
  // Camera background when toggled
  // if (camActive) {
  //   image(video, 0, 0, height, width);
  // }
  fill(0, 100, 200); //water color
  beginShape();
  for (let x = 0; x <= width; x += 20) {
    let y = 700 - fillHeight + sin(x * 0.02 + frameCount * 0.01) * 50;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  //draw water
  fill(0, 150, 255); //water color
  beginShape();
  for (let x = 0; x <= width; x += 10) {
    let y = 700 - fillHeight + sin(x * 0.02 + frameCount * 0.05) * 50;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  //fill with water
  if (isEmpty && addPressed && fillHeight <= 600) {
    fillHeight += 5;
  }
  if (fillHeight >= 600) {
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

  for (i = 0; i < floaties.length; i++) {
    floaties[i].Update();

    // Particles
    let p = new Particle();
    particles.push(p);

    for (let j = particles.length - 1; j >= 0; j--) {
      if (!particles[j].edges()) {
        particles[j].updatePos();
        particles[j].show();
      } else {
        particles.splice(j, 1);
      }
    }

    if (floaties[i].y > height + 10) {
      floaties.splice(i, 1);
    }
  }

  // Draw fish
  for (let f of fish) {
    f.display();
    f.swim();

    if (isFull && drainPressed && fillHeight >= 300) {
      f.moveDown();
      // console.log("fish moving down");
    }

    if (isEmpty && addPressed && fillHeight <= 300) {
      f.moveUp();
      // console.log("fish moving up");
    }
  }

  henry.Update();
  if (personAdded) {
    person.Update();
  }
  // person.Update();
}

// function toggleCamera() {
//   if (!camActive) {
//     // Activate the camera
//     camActive = true;
//   } else {
//     // Deactivate the camera
//     camActive = false;
//     // Reset the little guy's position to the center
//     guyPosition = createVector(width / 2, height / 2);
//   }
// }

function keyPressed() {
  console.log(keyCode);

  if (key == key.toUpperCase()) {
    var bouyancy = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
    bouyancy *= 0.01;
  } else {
    var bouyancy = -0.05;
  }

  if (key.length <= 1) {
    let newLetter = new floaty(0.05, bouyancy, 0.4, mouseX, -25, key);
    floaties.push(newLetter);
  }
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
    fill(51);
    //ellipse(this.x, this.y, 50, 50); // draw the circle
    textSize(50);
    text(this.letter, this.x, this.y);
  }

  CollisionDetection() {
    var collide = -fillHeight + 800 < this.y;
    if (collide) {
      if (!this.inWater && this.bouyantMult > 0) {
        this.yspeed *= 0.75;
      }

      if (!sound.isPlaying() && !this.inWater && this.yspeed > 3) {
        sound.play();
      }
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

    if (this.bouyantMult > 0 && this.inWater) {
      this.yspeed *= 0.9;
    }

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

// Particle Class
class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(30); // position
    this.vel = createVector(0, 0); //velocity
    this.acc = this.pos.copy().mult(random(0.01, 0.001)); //acceleration
    this.w = random(3, 5); //width
    this.color = [random(128, 128), random(238, 144), random(230, 255)]; // randomly generated color
  }
  updatePos() {
    // updates the velocity and position of particles
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }
  edges() {
    // if they reach outside the canvas, indicate when to remove the particles
    if (
      this.pos.x < -width / 2 ||
      this.pos.x > width / 2 ||
      this.pos.y < -height / 2 ||
      this.pos.y > height / 2
    ) {
      return true;
    } else {
      return false;
    }
  }
  show() {
    // appearance of the particles
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.w);
  }
}

class ducky {
  constructor(fall, bouyancy, bounciness, x, y) {
    this.fallMult = fall;
    this.bouyantMult = bouyancy;
    this.bounciness = bounciness;
    this.currMult = this.fall;
    this.yspeed = 0;
    this.inWater = false;
    this.x = x;
    this.y = y;
  }

  DrawDuck() {
    fill(51);
    image(duck, this.x, this.y, 450, 250);
  }

  CollisionDetection() {
    var collide = -fillHeight + 600 < this.y;
    if (collide) {
      if (!this.inWater) {
        this.yspeed *= 0.65;
      }

      if (!sound.isPlaying() && !this.inWater && this.yspeed > 3) {
        sound.play();
      }
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

    //this.yspeed *= 0.9;

    //this.y = -fillHeight + 600 - 100;

    this.DrawDuck();
  }
}

// Fish class
class Fish {
  constructor() {
    this.x = random(width);
    this.y = height + 20;
    this.size = random(10, 30);
    // this.speedY = random(0.5, 2);
    this.speed = random(1, 3);
    this.direction = 1; // -1 for left, 1 for right
  }

  moveDown() {
    this.y += this.speed * 1.5;
  }

  moveUp() {
    this.y -= this.speed * 1.5;
  }

  swim() {
    this.x += this.speed * this.direction;
    // Wrap around the screen if the fish moves beyond the canvas boundaries
    if (this.x < -this.size) {
      this.x = width + this.size;
    } else if (this.x > width + this.size) {
      this.x = -this.size;
    }
  }

  display() {
    fill(243, 187, 65); // Yellow fish color
    noStroke();
    ellipse(this.x, this.y, this.size * 2, this.size);
    triangle(
      this.x - this.size,
      this.y,
      this.x - this.size * 1.5,
      this.y - this.size / 2,
      this.x - this.size * 1.5,
      this.y + this.size / 2
    );
  }
}

class Person {
  constructor(fall, bouyancy, bounciness, x, y) {
    this.capture = null;
    this.diameter = 200; // Diameter of the circle
    this.maskPosX = width / 2; // X position of the circle
    this.maskPosY = height / 2; // Y position of the circle
    this.fallMult = fall;
    this.bouyantMult = bouyancy;
    this.bounciness = bounciness;
    this.currMult = this.fall;
    this.yspeed = 0;
    this.inWater = false;
    this.x = x;
    this.y = y;
  }

  setup() {
    // Create a capture object
    this.capture = createCapture(VIDEO);
    this.capture.size(width, height);
    this.capture.hide(); // Hide the capture element
  }

  CollisionDetection() {
    var collide = -fillHeight + 800 < this.y;
    if (collide) {
      // console.log(this.y);
      if (!this.inWater && this.bouyantMult > 0) {
        this.yspeed *= 0.65;
      }

      if (!sound.isPlaying() && !this.inWater && this.yspeed > 3) {
        sound.play();
      }
      this.inWater = true;
    } else {
      this.inWater = false;
    }
  }

  drawPerson() {
    // Create a circular mask
    let maskImage = createGraphics(width, height);
    maskImage.beginShape();
    for (let angle = 0; angle < TWO_PI; angle += 0.01) {
      let x = this.maskPosX + (cos(angle) * this.diameter) / 2;
      let y = this.maskPosY + (sin(angle) * this.diameter) / 2;
      maskImage.vertex(x, y);
    }
    maskImage.endShape(CLOSE);

    // Apply the mask
    this.capture.mask(maskImage);

    // Draw the masked video
    image(this.capture, this.x, this.y, 300, 300);
    maskImage.remove();
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

    //this.yspeed *= 0.9;

    //this.y = -fillHeight + 600 - 100;

    this.drawPerson();
  }
}

// to help with memory leak
// p5.Graphics.prototype.remove = function() {
//   if (this.elt.parentNode) {
//     this.elt.parentNode.removeChild(this.elt);
//   }
//   var idx = this._pInst._elements.indexOf(this);
//   // console.log(this._pInst);
//   if (idx !== -1) {
//     this._pInst._elements.splice(idx, 1);
//   }
//   for (var elt_ev in this._events) {
//     this.elt.removeEventListener(elt_ev, this._events[elt_ev]);
//   }
// };
