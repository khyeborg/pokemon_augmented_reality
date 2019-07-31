class Bulbasaur {

	constructor(startX, startY, startZ) {

		this.container = new Container3D({x: startX, y: startY, z: startZ, rotationY: random(0, 360)});

		// coordinates
		this.startX = 0;
		this.startY = 0;
		this.startZ = 0;
		this.yConstrain = startY;

		// animation
		this.animationCounter = 0;
		this.animationCounter2 = 99;
		this.forwardValue = 0.00075;

		// speed
		this.speed = 0.05;

		// blinking
		this.blinkCounter = Math.floor(random(0, 100));
		this.blinkTime = Math.floor(random(100, 120));

		// face 
	    var face_front = new Plane({
	        x: this.startX, y: this.startY, z: this.startZ, 
	        width: 0.5, height: 0.3,
	        asset: "bulbasaur_face"
	    });

	    var face_back = new Plane({
	        x: this.startX, y: this.startY, z: this.startZ-0.2, 
	        width: 0.5, height: 0.3, rotationY: 180,
	        red: 127, green: 228, blue: 186
	    });

	    var face_left = new Plane({
	        x: this.startX-0.25, y: this.startY, z: this.startZ-0.1, 
	        width: 0.2, height: 0.3, rotationY: -90,
	        red: 127, green: 228, blue: 186
	    });

	    var face_right = new Plane({
	        x: this.startX+0.25, y: this.startY, z: this.startZ-0.1, 
	        width: 0.2, height: 0.3, rotationY: 90,
	        red: 127, green: 228, blue: 186
	    });

	    var face_top = new Plane({
	        x: this.startX, y: this.startY+0.15, z: this.startZ-0.1, 
	        width: 0.5, height: 0.2, rotationX: -90,
	        asset: "bulbasaur_face_top"
	    });

	    var face_bottom = new Plane({
	        x: this.startX, y: this.startY-0.15, z: this.startZ-0.1, 
	        width: 0.5, height: 0.2, rotationX: 90,
	        red: 127, green: 228, blue: 186
	    });

	    var ear_left = new Box({
	        x: this.startX-0.19, y: this.startY+0.15+0.025, z: this.startZ-0.1, 
	        width: 0.12, height: 0.05, depth: 0.08,
	        red: 127, green: 228, blue: 186
	    });

	    var ear_right = new Box({
	        x: this.startX+0.19, y: this.startY+0.15+0.025, z: this.startZ-0.1, 
	        width: 0.12, height: 0.05, depth: 0.08,
	        red: 127, green: 228, blue: 186
	    });

	    // legs
	    var leg_front_left = new Box({
	        x: this.startX-0.15, y: this.startY-0.2, z: this.startZ-0.15, 
	        width: 0.1, height: 0.1, depth: 0.1,
	        red: 127, green: 228, blue: 186
	    });

	    var leg_front_right = new Box({
	        x: this.startX+0.15, y: this.startY-0.2, z: this.startZ-0.15, 
	        width: 0.1, height: 0.1, depth: 0.1,
	        red: 127, green: 228, blue: 186
	    });

	    var leg_back_left = new Box({
	        x: this.startX-0.15, y: this.startY-0.2, z: this.startZ-0.55, 
	        width: 0.1, height: 0.1, depth: 0.1,
	        red: 127, green: 228, blue: 186
	    });

	    var leg_back_right = new Box({
	        x: this.startX+0.15, y: this.startY-0.2, z: this.startZ-0.55, 
	        width: 0.1, height: 0.1, depth: 0.1,
	        red: 127, green: 228, blue: 186
	    });

	    // body
	    var body = new Box({
	        x: this.startX, y: this.startY-0.05, z: this.startZ-0.4, 
	        width: 0.4, height: 0.25, depth: 0.4,
	        asset: "bulbasaur_body"
	    });

	    // seed
	    var seed_front = new Plane({
	        x: this.startX, y: this.startY+0.185, z: this.startZ-0.2, 
	        width: 0.5, height: 0.22,
	        asset: "bulbasaur_seed_side"
	    });

	    var seed_back = new Plane({
	        x: this.startX, y: this.startY+0.185, z: this.startZ-0.65, 
	        width: 0.5, height: 0.22, rotationY: 180,
	        asset: "bulbasaur_seed_side"
	    });

	    var seed_left = new Plane({
	        x: this.startX-0.25, y: this.startY+0.185, z: this.startZ-0.425, 
	        width: 0.45, height: 0.22, rotationY: -90,
	        asset: "bulbasaur_seed_side2"
	    });

	    var seed_right = new Plane({
	        x: this.startX+0.25, y: this.startY+0.185, z: this.startZ-0.425, 
	        width: 0.45, height: 0.22, rotationY: 90,
	        asset: "bulbasaur_seed_side2"
	    });

	    var seed_top = new Plane({
	        x: this.startX, y: this.startY+0.295, z: this.startZ-0.425, 
	        width: 0.5, height: 0.45, rotationX: -90,
	        asset: "bulbasaur_seed_top"
	    });

	    var seed_bottom = new Plane({
	        x: this.startX, y: this.startY+0.075, z: this.startZ-0.425, 
	        width: 0.5, height: 0.45, rotationX: 90,
	        red: 124, green: 197, blue: 131
	    });

	    var seedtop_front = new Plane({
	        x: this.startX, y: this.startY+0.335, z: this.startZ-0.325, 
	        width: 0.2, height: 0.08,
	        asset: "bulbasaur_seedtop_side"
	    });

	    var seedtop_back = new Plane({
	        x: this.startX, y: this.startY+0.335, z: this.startZ-0.525, 
	        width: 0.2, height: 0.08, rotationY: 180,
	        asset: "bulbasaur_seedtop_side"
	    });

	    var seedtop_left = new Plane({
	        x: this.startX-0.1, y: this.startY+0.335, z: this.startZ-0.425, 
	        width: 0.2, height: 0.08, rotationY: -90,
	        asset: "bulbasaur_seedtop_side"
	    });

	    var seedtop_right = new Plane({
	        x: this.startX+0.1, y: this.startY+0.335, z: this.startZ-0.425, 
	        width: 0.2, height: 0.08, rotationY: 90,
	        asset: "bulbasaur_seedtop_side"
	    });

	    var seedtop_top = new Plane({
	        x: this.startX, y: this.startY+0.375, z: this.startZ-0.425, 
	        width: 0.2, height: 0.2, rotationX: -90,
	        asset: "bulbasaur_seedtop_top"
	    });

	    this.sensor = new Box({
	      x: this.startX , y: this.startY, z: this.startZ + 0.5,
	      width: 0.1, height: 0.1, depth: 0.1,
	      red: 0, green: 255, blue: 0,
	      opacity: boxOpacity
	    });

		// add the different components of the Pokemon
		// bulbasaur's face
	    this.container.addChild(face_front);
	    this.container.addChild(face_back);
	    this.container.addChild(face_left);
	    this.container.addChild(face_right);
	    this.container.addChild(face_top);
	    this.container.addChild(face_bottom);

	    // bulbasaur's ears
	    this.container.addChild(ear_left);
	    this.container.addChild(ear_right);

	    // bulbasaur's legs
	    this.container.addChild(leg_front_left);
	    this.container.addChild(leg_front_right);
	    this.container.addChild(leg_back_left);
	    this.container.addChild(leg_back_right);

	    // bulbasaur's body
	    this.container.addChild(body);

	    // bulbasaur's seed
	    this.container.addChild(seed_front);
	    this.container.addChild(seed_back);
	    this.container.addChild(seed_left);
	    this.container.addChild(seed_right);
	    this.container.addChild(seed_top);
	    this.container.addChild(seed_bottom);
	    this.container.addChild(seedtop_front);
	    this.container.addChild(seedtop_back);
	    this.container.addChild(seedtop_left);
	    this.container.addChild(seedtop_right);
	    this.container.addChild(seedtop_top);

	    // get all the entities of the container 
    	this.containerArray = this.container.getChildren();

    	this.container.addChild(this.sensor);

	    // get all the entities of the container 
    	this.containerArray = this.container.getChildren();

    	// perlin noise offset
    	this.noiseOffset = random(10000);
	}

	animate() {
		this.animationCounter += 3;
		this.animationCounter2 += 3;

		if (this.animationCounter === 99) {
			this.containerArray[8].setZ(this.startZ-0.15 + 0.05);
			this.containerArray[11].setZ(this.startZ-0.55 + 0.05);
		}
		if (this.animationCounter === 201) {
			this.containerArray[8].setZ(this.startZ-0.15);
			this.containerArray[11].setZ(this.startZ-0.55);
			this.animationCounter = 0;
		}

		if (this.animationCounter2 === 99) {
			this.containerArray[9].setZ(this.startZ-0.15 + 0.05);
			this.containerArray[10].setZ(this.startZ-0.55 + 0.05);
		}
		if (this.animationCounter2 === 201) {
			this.containerArray[9].setZ(this.startZ-0.15);
			this.containerArray[10].setZ(this.startZ-0.55);
			this.animationCounter2 = 0;
		}

		this.blinkCounter += 1;

		if (this.blinkCounter >= this.blinkTime) {
	        this.containerArray[0].setAsset("bulbasaur_face_blink");
	        if (this.blinkCounter == this.blinkTime + 15) {
	            this.containerArray[0].setAsset("bulbasaur_face");
	            this.blinkTime = Math.floor(random(100, 120));
	            this.blinkCounter = 0;
	        }
	    }
	}

	move() {
		// sway a little with perlin noise
	    var swayAmount = map(noise(this.noiseOffset), 0, 1, -1, 1);
	    this.container.spinY(swayAmount);
	    this.noiseOffset += 0.01;

	    // compute the world position of our sensor (not the local position inside of our container)
	    var vectorHUD = new THREE.Vector3();
	    vectorHUD.setFromMatrixPosition(this.sensor.tag.object3D.matrixWorld);

	    // now compute how far off we are from this position
	    var xDiff = vectorHUD.x - this.container.getX();
	    //var yDiff = vectorHUD.y - this.container.getY();
	    var zDiff = vectorHUD.z - this.container.getZ();

	    // nudge the container toward this position
	    this.container.nudge(xDiff * this.speed, 0, zDiff * this.speed);
	    this.container.constrainPosition(-xConstrain, xConstrain, this.yConstrain, this.yConstrain, -zConstrain, zConstrain);
	}
 }
