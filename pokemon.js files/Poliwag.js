class Poliwag {

	constructor(startX, startY, startZ) {

		this.container = new Container3D({x: startX, y: startY, z: startZ, rotationY: random(0, 360)});

		// coordinates
		this.startX = 0;
		this.startY = 0;
		this.startZ = 0;
		this.yConstrain = startY;
		
		// animation
		this.leftLegRotateCounter = 0;
		this.rightLegRotateCounter = 0;
		this.leftLegRotateDirection = 1;
		this.rightLegRotateDirection = 1;
		this.tailRotateCounter = 0;
		this.tailRotateDirection = 1;

		// speed
		this.speed = 0.05;

		// blinking
		this.blinkCounter = Math.floor(random(0, 100));
		this.blinkTime = Math.floor(random(100, 120));

	    // face 
	    var face = new Plane({
	        x: this.startX, y: this.startY, z: this.startZ, 
	        width: 0.5, height: 0.5,
	        asset: "poliwag_face"
	    });

	    // back 
	    var back = new Plane({
	        x: this.startX, y: this.startY, z: this.startZ-0.5, 
	        width: 0.5, height: 0.5, rotationY: 180,
	        red:102, green:148, blue:207
	    });

	    // side left
	    var left = new Plane({
	        x: this.startX-0.25, y: this.startY, z: this.startZ-0.25, 
	        width: 0.5, height: 0.5, rotationY: -90,
	        red: 102, green: 148, blue: 207
	    });

	    // side right
	    var right = new Plane({
	        x: this.startX+0.25, y: this.startY, z: this.startZ-0.25, 
	        width: 0.5, height: 0.5, rotationY: 90,
	        red:102, green:148, blue:207
	    });

	    // head 
	    var head = new Plane({
	        x: this.startX, y: this.startY+0.25, z: this.startZ-0.25, 
	        width: 0.5, height: 0.5, rotationX: -90,
	        red:102, green:148, blue:207
	    });

	    // bottom 
	    var bottom = new Plane({
	        x: this.startX, y: this.startY-0.25, z: this.startZ-0.25, 
	        width: 0.5, height: 0.5, rotationX: 90,
	        red:102, green:148, blue:207
	    });

	    // mouth 
	    var mouth_front = new Plane({
	        x: this.startX, y: this.startY+0.03, z: this.startZ+0.05, 
	        width: 0.09, height: 0.06,
	        asset: "poliwag_mouth"
	    });

	    var mouth_top = new Plane({
	        x: this.startX, y: this.startY+0.06, z: this.startZ+0.025, 
	        width: 0.09, height: 0.05, rotationX: -90,
	        red:241, green:200, blue:217
	    });

	    var mouth_bottom = new Plane({
	        x: this.startX, y: this.startY, z: this.startZ+0.025, 
	        width: 0.09, height: 0.05, rotationX: 90,
	        red:241, green:200, blue:217,
	    });

	    var mouth_left = new Plane({
	        x: this.startX-0.045, y: this.startY+0.03, z: this.startZ+0.025, 
	        width: 0.05, height: 0.06, rotationY: -90,
	        red:241, green:200, blue:217
	    });

	    var mouth_right = new Plane({
	        x: this.startX+0.045, y: this.startY+0.03, z: this.startZ+0.025, 
	        width: 0.05, height: 0.06, rotationY: 90,
	        red:241, green:200, blue:217
	    });

	    // legs
	    var leg_left = new Box ({
	        x: this.startX-0.12, y: this.startY-0.275, z: this.startZ-0.08,
	        width: 0.1, height:0.05, depth:0.3,
	        red:102, green:148, blue:207
	    });

	    var leg_right = new Box ({
	        x: this.startX+0.12, y: this.startY-0.275, z: this.startZ-0.08,
	        width: 0.1, height:0.05, depth:0.3,
	        rotationX: 15,
	        red:102, green:148, blue:207
	    });

	    // tail
	    var tail_blue = new Box ({
	        x: this.startX, y: this.startY-0.1, z: this.startZ-0.5,
	        width: 0.05, height:0.05, depth:0.5,
	        red:102, green:148, blue:207
	    });

	    var tail_white = new Box ({
	        x: this.startX, y: this.startY-0.1, z: this.startZ-0.5,
	        width: 0.25, height:0.025, depth:0.8,
	        red:250, green:249, blue:246
	        //red:0, green:0, blue:0
	    });

	    this.sensor = new Box({
	      x: this.startX , y: this.startY, z: this.startZ + 0.5,
	      width: 0.1, height: 0.1, depth: 0.1,
	      red: 0, green: 255, blue: 0,
	      opacity: boxOpacity
	    });

	    // add the different components of the Pokemon
	    // poliwag body
	    this.container.addChild(face);
	    this.container.addChild(back);
	    this.container.addChild(left);
	    this.container.addChild(right);
	    this.container.addChild(head);
	    this.container.addChild(bottom);
	    
	    // poliwag mouth
	    this.container.addChild(mouth_front);
	    this.container.addChild(mouth_top);
	    this.container.addChild(mouth_bottom);
	    this.container.addChild(mouth_left);
	    this.container.addChild(mouth_right);

	    // poliwag legs
	    this.container.addChild(leg_left);
	    this.container.addChild(leg_right);

	    // poliwag tail
	    this.container.addChild(tail_blue);
	    this.container.addChild(tail_white);

	    // get all the entities of the Poliwag container 
    	this.containerArray = this.container.getChildren();

	    this.container.addChild(this.sensor);

	    // get all the entities of the container 
    	this.containerArray = this.container.getChildren();

    	// perlin noise offset
    	this.noiseOffset = random(10000);
	}

	animate() {
		// spin Poliwag's legs
	    this.containerArray[11].spinX(0.5 * this.leftLegRotateDirection); // position 11: Box for left leg
	    this.containerArray[12].spinX(-0.5 * this.rightLegRotateDirection); // position 12: Box for right leg
	    this.containerArray[13].spinX(0.3 * this.tailRotateDirection);
	    this.containerArray[14].spinX(0.3 * this.tailRotateDirection);
	    
	    this.leftLegRotateCounter += 1;
	    this.rightLegRotateCounter += 1;
	    this.tailRotateCounter += 1;

	    if (this.leftLegRotateCounter == 30) {
	        this.leftLegRotateDirection *= -1;
	        this.leftLegRotateCounter = 0;
	    }

	    if (this.rightLegRotateCounter == 30) {
	        this.rightLegRotateDirection *= -1;
	        this.rightLegRotateCounter = 0;
	    }

	    if (this.tailRotateCounter == 25) {
	        this.tailRotateDirection *= -1;
	        this.tailRotateCounter = 0;
	    }

	    this.blinkCounter += 1;
	    if (this.blinkCounter >= this.blinkTime) {
	        this.containerArray[0].setAsset("poliwag_face_blink");
	        if (this.blinkCounter == this.blinkTime + 15) {
	            this.containerArray[0].setAsset("poliwag_face");
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
