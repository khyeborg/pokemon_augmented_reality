class Pikachu {

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
	    var face = new Plane({
	        x: this.startX, y: this.startY, z: this.startZ, 
	        width: 0.5, height: 0.35,
	        asset: "pikachu_face"
	    });

	    var back = new Plane({
	        x: this.startX, y: this.startY, z: this.startZ-0.6, 
	        width: 0.5, height: 0.35, rotationY: 180,
	        red: 246, green: 221, blue: 121
	    });

	    var left = new Plane({
	        x: this.startX-0.25, y: this.startY, z: this.startZ-0.3, 
	        width: 0.6, height: 0.35, rotationY: -90,
	        asset: "pikachu_left"
	    });

	    var right = new Plane({
	        x: this.startX+0.25, y: this.startY, z: this.startZ-0.3, 
	        width: 0.6, height: 0.35, rotationY: 90,
	        asset: "pikachu_right"
	    });

	    var top = new Plane({
	        x: this.startX, y: this.startY+0.175, z: this.startZ-0.3, 
	        width: 0.5, height: 0.6, rotationX: -90,
	        asset: "pikachu_top"
	    });

	    var bottom = new Plane({
	        x: this.startX, y: this.startY-0.175, z: this.startZ-0.3, 
	        width: 0.5, height: 0.6, rotationX: 90,
	        red: 246, green: 221, blue: 121
	    });

	    // legs
	    var leg_front_left = new Box({
	        x: this.startX-0.13, y: this.startY-0.226, z: this.startZ-0.15, 
	        width: 0.12, height: 0.12, depth: 0.12,
	        red: 246, green: 221, blue: 121
	    });

	    var leg_front_right = new Box({
	        x: this.startX+0.13, y: this.startY-0.226, z: this.startZ-0.15, 
	        width: 0.12, height: 0.12, depth: 0.12,
	        red: 246, green: 221, blue: 121
	    });

	    var leg_back_left = new Box({
	        x: this.startX-0.13, y: this.startY-0.226, z: this.startZ-0.54, 
	        width: 0.12, height: 0.12, depth: 0.12,
	        red: 246, green: 221, blue: 121
	    });

	    var leg_back_right = new Box({
	        x: this.startX+0.13, y: this.startY-0.226, z: this.startZ-0.54, 
	        width: 0.12, height: 0.12, depth: 0.12,
	        red: 246, green: 221, blue: 121
	    });

	    // ears 
	    var ear_left = new Box({
	        x: this.startX-0.12, y: this.startY+0.26, z: this.startZ-0.08, 
	        width: 0.13, height: 0.23, depth: 0.06,
	        //rotationX: -10,
	        red: 246, green: 221, blue: 121
	    });

	    var ear_right = new Box({
	        x: this.startX+0.12, y: this.startY+0.26, z: this.startZ-0.08, 
	        width: 0.13, height: 0.23, depth: 0.06,
	        //rotationX: -10,
	        red: 246, green: 221, blue: 121
	    });

	    var ear_left_top = new Box({
	        x: this.startX-0.12, y: this.startY+0.425, z: this.startZ-0.08, 
	        width: 0.13, height: 0.1, depth: 0.06,
	        //rotationX: -10,
	        red: 34, green: 35, blue: 33
	    });

	    var ear_right_top = new Box({
	        x: this.startX+0.12, y: this.startY+0.425, z: this.startZ-0.08, 
	        width: 0.13, height: 0.1, depth: 0.06,
	        //rotationX: -10,
	        red: 34, green: 35, blue: 33
	    });

	    // tail
	    var tail_bottom = new Box({
	        x: this.startX, y: this.startY+0.19, z: this.startZ-0.61, 
	        width: 0.08, height: 0.22, depth: 0.02,
	        rotationZ: -50,
	        red: 157, green: 127, blue: 91
	    });

	    var tail_middle = new Box({
	        x: this.startX, y: this.startY+0.32, z: this.startZ-0.61, 
	        width: 0.12, height: 0.28, depth: 0.02,
	        rotationZ: -50,
	        red: 246, green: 221, blue: 121
	    });

	    var tail_top = new Box({
	        x: this.startX+0.04, y: this.startY+0.49, z: this.startZ-0.61, 
	        width: 0.2, height: 0.32, depth: 0.02,
	        rotationZ: -50,
	        red: 246, green: 221, blue: 121
	    });

	    this.sensor = new Box({
	      x: this.startX , y: this.startY, z: this.startZ + 0.5,
	      width: 0.1, height: 0.1, depth: 0.1,
	      red: 0, green: 255, blue: 0,
	      opacity: boxOpacity
	    });

		// add the different components of the Pokemon
		// pikachu's body
	    this.container.addChild(face);
	    this.container.addChild(back);
	    this.container.addChild(left);
	    this.container.addChild(right);
	    this.container.addChild(top);
	    this.container.addChild(bottom);

	    // pikachu's legs 
	    this.container.addChild(leg_front_left);
	    this.container.addChild(leg_front_right);
	    this.container.addChild(leg_back_left);
	    this.container.addChild(leg_back_right);

	    // pikachu's ears
	    this.container.addChild(ear_left);
	    this.container.addChild(ear_right);
	    this.container.addChild(ear_left_top);
	    this.container.addChild(ear_right_top);

	    // pikachu's tail
	    this.container.addChild(tail_bottom);
	    this.container.addChild(tail_middle);
	    this.container.addChild(tail_top);

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
			this.containerArray[6].setZ(this.startZ-0.15 + 0.05);
			this.containerArray[8].setZ(this.startZ-0.54 + 0.05);
		}
		if (this.animationCounter === 201) {
			this.containerArray[6].setZ(this.startZ-0.15);
			this.containerArray[8].setZ(this.startZ-0.54);
			this.animationCounter = 0;
		}

		if (this.animationCounter2 === 99) {
			this.containerArray[7].setZ(this.startZ-0.15 + 0.05);
			this.containerArray[9].setZ(this.startZ-0.54 + 0.05);
		}
		if (this.animationCounter2 === 201) {
			this.containerArray[7].setZ(this.startZ-0.15);
			this.containerArray[9].setZ(this.startZ-0.54);
			this.animationCounter2 = 0;
		}

		this.blinkCounter += 1;

		if (this.blinkCounter >= this.blinkTime) {
	        this.containerArray[0].setAsset("pikachu_face_blink");
	        if (this.blinkCounter == this.blinkTime + 15) {
	            this.containerArray[0].setAsset("pikachu_face");
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
