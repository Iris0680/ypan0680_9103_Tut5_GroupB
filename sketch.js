// Array to store circles for the foreground
let myCircles = []; 
let numOfCircles = 33; 

// Variables for positioning and sizing elements
let bottomX = 111;
let bottomY = 494;
let diameter1 = 34;
let diameter2 = 25;
let spacing1 = 37;
let spacing2 = 105;
let spacing3 = 43;
let topX1 = 148;
let topX2 = 180;
let topY = 445;

let noiseScale = 0.1; // Scale for Perlin noise
let zOffset = 0; // Offset for dynamic effect
let particleAlpha = 20; // Transparency for flowing lines

// Positions and sizes for foreground circles
let circlePositions = [
  [85, 40], [85, 85], [90, 120], [114, 130], [122, 153], [120, 183],
  [125, 224], [150, 248], [175, 252], [198, 247], [222, 253], [247, 250],
  [272, 248], [280, 218], [285, 190], [289, 158], [285, 125], [300, 120],
  [325, 125], [350, 134], [358, 115], [180, 165], [170, 185], [190, 183],
  [210, 204], [230, 185], [241, 170], [210, 230], [210, 289], [200, 340],
  [202, 385], [208, 410], [200, 432]
];
let circleDiameters = [50, 43, 29, 27, 23, 40, 53, 28, 26, 20, 31, 22, 33, 35, 25, 44, 20, 15, 33, 22, 20, 16, 16, 26, 35, 22, 16, 20, 47, 61, 30, 23, 23];

// Particle system for background flow
let particles = [];
let cols, rows;
let scl = 10; // Scale for the flow field

function setup() {
  createCanvas(400, 600);
  cols = floor(width / scl);
  rows = floor(height / scl);

  // Initialize flow field particles
  for (let i = 0; i < 1000; i++) {
    particles.push(new Particle());
  }

  // Initialize circles for foreground
  for (let i = 0; i < numOfCircles; i++) {
    myCircles.push(new MyCircleClass(circlePositions[i][0], circlePositions[i][1], circleDiameters[i]));
  }
}

class MyCircleClass {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color1 = color(228, 102, 103);
    this.color2 = color(142, 171, 126);
  }
  
  draw() {
    fill(this.color1);
    noStroke();
    arc(this.x, this.y, this.size, this.size, HALF_PI, -HALF_PI, PIE);
    fill(this.color2);
    arc(this.x, this.y, this.size, this.size, -HALF_PI, HALF_PI, PIE);
  }
}

function draw() {
  drawFlowingBackground(); // Draw dynamic background with flowing effect

  // Draw each circle as part of the foreground
  for (let i = 0; i < numOfCircles; i++) {
    myCircles[i].draw();
  }

  // Draw additional foreground elements
  drawBottomShapes();

  // Increment zOffset to create flow in the background
  zOffset += 0.01;
}

function drawFlowingBackground() {
  background(30, 30, 40, 50); // Slightly translucent background for blending

  // Create Perlin noise flow field and move particles
  let yOffset = 0;
  for (let y = 0; y < rows; y++) {
    let xOffset = 0;
    for (let x = 0; x < cols; x++) {
      let angle = noise(xOffset, yOffset, zOffset) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      xOffset += noiseScale;
    }
    yOffset += noiseScale;
  }

  // Move and display particles
  for (let particle of particles) {
    particle.follow();
    particle.update();
    particle.edges();
    particle.show();
  }
}

// Particle class for background flow effect
class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
    this.prevPos = this.pos.copy();
  }

  follow() {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let angle = noise(x * noiseScale, y * noiseScale, zOffset) * TWO_PI * 4;
    let force = p5.Vector.fromAngle(angle);
    force.setMag(0.1);
    this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    stroke(255, particleAlpha); // Set color and transparency for flowing effect
    strokeWeight(1);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }
  }
}

// Foreground shapes (rectangles and semicircles)
function drawBottomShapes() {
  stroke(0);
  strokeWeight(2);

  fill(142, 171, 126);
  rect(27, 450, 345, 55);
  line(65, 450, 65, 505);
  line(340, 450, 340, 505);

  fill(217, 194, 125);
  rect(92, 444, 204, 52);

  stroke(217, 194, 125);
  fill(228, 102, 103);
  rect(130, 446, 35, 48);

  fill(142, 171, 126);
  rect(165, 446, 37, 48);
  rect(237, 446, 35, 48);

  arc(285, 494, 19, 28, PI, 0, fill(142, 171, 126));

  for (let i = 0; i < 2; i++) {
    fill(i % 2 === 0 ? color(142, 171, 126) : color(228, 102, 103));
    arc(topX1 + i * spacing2, topY, diameter1, diameter1, 0, PI);
  }

  for (let i = 0; i < 2; i++) {
    fill(i % 2 === 0 ? color(228, 102, 103) : color(142, 171, 126));
    arc(topX2 + i * spacing3, topY, diameter2, diameter2, 0, PI);
  }

  for (let i = 0; i < 3; i++) {
    fill(i % 3 === 0 ? color(142, 171, 126) : (i % 3 === 1 ? color(217, 194, 125) : color(228, 102, 103)));
    arc(bottomX + i * spacing1, bottomY, diameter1, diameter1, PI, 0);
  }

  for (let i = 0; i < 2; i++) {
    fill(i % 2 === 0 ? color(228, 102, 103) : color(217, 194, 125));
    arc(bottomX + i * spacing1 + 110, bottomY, diameter1, diameter1, PI, 0);
  }

  stroke(0);
  strokeWeight(2);
  for (let i = 0; i < 2; i++) {
    fill(i % 2 === 0 ? color(228, 102, 103) : color(142, 171, 126));
    arc(topX1 + i * spacing2, topY, diameter1, diameter1, PI, 0);
  }

  for (let i = 0; i < 2; i++) {
    fill(i % 2 === 0 ? color(142, 171, 126) : color(228, 102, 103));
    arc(topX2 + i * spacing3, topY, diameter2, diameter2, PI, 0);
  }

  stroke(217, 194, 125);
  line(130, 446, 270, 446);
}