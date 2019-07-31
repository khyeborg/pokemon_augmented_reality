class Diglett {

	constructor(startX, startY, startZ) {

		this.container = new Container3D({x: startX, y: startY, z: startZ, rotationY: random(0, 360)});

		// coordinates
		this.startX = 0;
		this.startY = 0;
		this.startZ = 0;
		this.yConstrain = startY;

		// animation
		this.initialY = startY;
		this.downValue = -0.0015;

		// speed
		this.speed = 0.03;

		// blinking
		this.blinkCounter = Math.floor(random(0, 100));
		this.blinkTime = Math.floor(random(100, 120));


		// face 
	    var face = new Plane({
	        x: this.startX, y: this.startY, z: this.startZ, 
	        width: 0.3, height: 0.5,
	        asset: "diglett_face"
	    });

	    // back 
	    var back = new Plane({
	        x: this.startX, y: this.startY, z: this.startZ-0.3, 
	        width: 0.3, height: 0.5, rotationY: 180,
	        red:182, green:148, blue:123
	    });

	    // side left
	    var left = new Plane({
	        x: this.startX-0.15, y: this.startY, z: this.startZ-0.15, 
	        width: 0.3, height: 0.5, rotationY: -90,
	        red:182, green:148, blue:123
	    });

	    // side right
	    var right = new Plane({
	        x: this.startX+0.15, y: this.startY, z: this.startZ-0.15, 
	        width: 0.3, height: 0.5, rotationY: 90,
	        red:182, green:148, blue:123
	    });

	    // head 
	    var head = new Plane({
	        x: this.startX, y: this.startY+0.25, z: this.startZ-0.15, 
	        width: 0.3, height: 0.3, rotationX: -90,
	        red:182, green:148, blue:123
	    });

	    // bottom 
	    var bottom = new Plane({
	        x: this.startX, y: this.startY-0.25, z: this.startZ-0.15, 
	        width: 0.3, height: 0.3, rotationX: 90,
	        red:182, green:148, blue:123
	    });

	    // nose 
	    var nose_front = new Plane({
	        x: this.startX, y: this.startY+0.025, z: this.startZ+0.05, 
	        width: 0.12, height: 0.07,
	        asset: "diglett_nose"
	    });

	    var nose_top = new Plane({
	        x: this.startX, y: this.startY+0.055, z: this.startZ+0.025, 
	        width: 0.12, height: 0.05, rotationX: -90,
	        red:228, green:174, blue:206
	    });

	    var nose_bottom = new Plane({
	        x: this.startX, y: this.startY-0.005, z: this.startZ+0.025, 
	        width: 0.12, height: 0.05, rotationX: 90,
	        red:228, green:174, blue:206
	    });

	    var nose_left = new Plane({
	        x: this.startX-0.06, y: this.startY+0.025, z: this.startZ+0.025, 
	        width: 0.05, height: 0.07, rotationY: -90,
	        red:228, green:174, blue:206
	    });

	    var nose_right = new Plane({
	        x: this.startX+0.06, y: this.startY+0.025, z: this.startZ+0.025, 
	        width: 0.05, height: 0.07, rotationY: 90,
	        red:228, green:174, blue:206
	    });

	    // ground 
	    var ground = new Box({
	    	x: this.startX, y: this.startY-0.3, z: this.startZ-0.15, 
	    	width: 0.5, height: 0.1, depth: 0.5,
	    	red:123, green:133, blue:125
	    });

	    // stones 
	    var stone1 = new Box({
	    	x: this.startX-0.15, y: this.startY-0.235, z: this.startZ+0.025, 
	    	width: 0.06, height: 0.03, depth: 0.05,
	    	red:183, green:204, blue:195
	    });

	    var stone2 = new Box({
	    	x: this.startX-0.19, y: this.startY-0.24, z: this.startZ-0.15, 
	    	width: 0.03, height: 0.02, depth: 0.03,
	    	red:183, green:204, blue:195
	    });

	    var stone3 = new Box({
	    	x: this.startX+0.2, y: this.startY-0.23, z: this.startZ-0.09, 
	    	width: 0.06, height: 0.04, depth: 0.06,
	    	red:183, green:204, blue:195
	    });

	    this.sensor = new Box({
	      x: this.startX , y: this.startY, z: this.startZ + 0.5,
	      width: 0.1, height: 0.1, depth: 0.1,
	      red: 0, green: 255, blue: 0,
	      opacity: boxOpacity
	    });

		// add the different components of the Pokemon
		// diglett's body
	    this.container.addChild(face);
	    this.container.addChild(back);
	    this.container.addChild(left);
	    this.container.addChild(right);
	    this.container.addChild(head);
	    this.container.addChild(bottom);

	    // diglett's nose
	    this.container.addChild(nose_front);
	    this.container.addChild(nose_top);
	    this.container.addChild(nose_bottom);
	    this.container.addChild(nose_left);
	    this.container.addChild(nose_right);

	    // ground
	    this.container.addChild(ground);
	    this.container.addChild(stone1);
	    this.container.addChild(stone2);
		this.container.addChild(stone3);

		this.container.addChild(this.sensor);

	    // get all the entities of the container 
    	this.containerArray = this.container.getChildren();

    	// perlin noise offset
    	this.noiseOffset = random(10000);
	}

	animate() {

		this.containerArray[0].setY(this.startY - this.downValue);
		this.containerArray[1].setY(this.startY - this.downValue);
		this.containerArray[2].setY(this.startY - this.downValue);
		this.containerArray[3].setY(this.startY - this.downValue);
		this.containerArray[4].setY(this.startY + 0.25 - this.downValue);
		this.containerArray[5].setY(this.startY - 0.25 - this.downValue);
		this.containerArray[6].setY(this.startY + 0.025 - this.downValue);
		this.containerArray[7].setY(this.startY + 0.055 - this.downValue);
		this.containerArray[8].setY(this.startY - 0.005 - this.downValue);
		this.containerArray[9].setY(this.startY + 0.025 - this.downValue);
		this.containerArray[10].setY(this.startY + 0.025 - this.downValue);
		
		this.startY += this.downValue;

		if (this.startY < this.initialY - 0.05) {
			this.downValue *= -1;
		}
		if (this.startY == this.initialY) {
			this.downValue *= -1;
		}
		
		this.blinkCounter += 1;

		if (this.blinkCounter >= this.blinkTime) {
	        this.containerArray[0].setAsset("diglett_face_blink");
	        if (this.blinkCounter == this.blinkTime + 15) {
	            this.containerArray[0].setAsset("diglett_face");
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