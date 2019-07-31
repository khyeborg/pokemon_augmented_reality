// variable to hold a reference to our A-Frame world
var world;

var myContainer;
var poliwag;

var poliwagDirection = 1;

var sketch1 = function(p) {
	
	p.setup = function() {
		p.createCanvas(500, 500);
	}

	p.draw = function() {
		drawPoliwag();
	}
}

var temp1 = new p5(sketch1);

function setup() {
	// no canvas needed
	createCanvas(500, 500);

	// construct the A-Frame world
	world = new World('VRScene');
	world.setFlying(true);

	var floor = new Plane({
		x: 0, y: 0,
		width: 100, height: 100,
		rotationX: -90,
	});
	world.add(floor);

	poliwag = new Box({
		x: 0.5, y: 1, z: -0.5,
		asset: 'defaultCanvas0'
	});
	world.add(poliwag);
}

function draw() {
	drawPoliwag();

	poliwag.setX(poliwag.x + 0.1 * poliwagDirection);
	if (poliwag.x >= 10 || poliwag.x <= -10) {poliwagDirection *= -1;}
}

function drawPoliwag() {
	rectMode(CENTER);
	background(255);
  	noStroke();

	// poliwag
    fill(102, 148, 207);
    rect(250, 250, 500, 500);

    // poliwag's tummy
    fill(250, 250, 250);
    rect(250, 360, 411, 278, 10);
    rectMode(CORNER);
    fill(54, 40, 40);
    rect(100, 267, 33, 239);
    rect(100, 267, 300, 33);
    rect(368, 267, 33, 239);
    rect(172, 467, 228, 33); 
    rect(172, 344, 33, 161);
    rect(172, 344, 150, 33);
    rect(294, 344, 33, 100);
    rect(250, 411, 72, 33);

    // poliwag's eyes
    fill(255);
    rect(45, 45, 133, 133);
    rect(323, 45, 133, 133);
    fill(0);
    rect(73, 45, 105, 105);
    rect(323, 45, 105, 105);
    fill(255);
    rect(117, 62, 45, 45);
    rect(340, 62, 45, 45);

    // poliwag's mouth
    fill(241, 200, 217);
    rect(200, 178, 106, 72);
    fill(78, 46, 67);
    rect(228, 206, 50, 22);
}



