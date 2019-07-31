class Magnemite {

	constructor(startX, startY, startZ) {

		this.container = new Container3D({x: startX, y: startY, z: startZ, rotationY: random(0, 360)});

		// coordinates
		this.startX = 0;
		this.startY = 0;
		this.startZ = 0;
		this.yConstrain = startY;

		// animation
		this.initialZ1 = 0;
		this.initialZ2 = 0;
		this.animationCounter = 0;
		this.moveValue = 0.001;

		// speed
		this.speed = 0.05;
		this.speedY = 0.01;

		// blinking
		this.blinkCounter = Math.floor(random(0, 100));
		this.blinkTime = Math.floor(random(100, 120));

		// face 
	    var face = new Plane({
	        x: this.startX, y: this.startY, z: this.startZ, 
	        width: 0.3, height: 0.3,
	        asset: "magnemite_face"
	    });

	    // back 
	    var back = new Plane({
	        x: this.startX, y: this.startY, z: this.startZ-0.3, 
	        width: 0.3, height: 0.3, rotationY: 180,
	        red: 172, green: 205, blue: 212
	    });

	    // side left
	    var left = new Plane({
	        x: this.startX-0.15, y: this.startY, z: this.startZ-0.15, 
	        width: 0.3, height: 0.3, rotationY: -90,
	        red: 172, green: 205, blue: 212
	    });

	    // side right
	    var right = new Plane({
	        x: this.startX+0.15, y: this.startY, z: this.startZ-0.15, 
	        width: 0.3, height: 0.3, rotationY: 90,
	        red: 172, green: 205, blue: 212
	    });

	    // head 
	    var head = new Plane({
	        x: this.startX, y: this.startY+0.15, z: this.startZ-0.15, 
	        width: 0.3, height: 0.3, rotationX: -90,
	        red: 172, green: 205, blue: 212
	    });

	    // bottom 
	    var bottom = new Plane({
	        x: this.startX, y: this.startY-0.15, z: this.startZ-0.15, 
	        width: 0.3, height: 0.3, rotationX: 90,
	        red: 172, green: 205, blue: 212
	    });

	    // screw box
	    var screwbox_left = new Box({
	        x: this.startX-0.1, y: this.startY-0.1, z: this.startZ+0.01, 
	        width: 0.02, height: 0.02, depth: 0.02,
	        red: 195, green: 204, blue: 203
	    });

	    var screwbox_right = new Box({
	        x: this.startX+0.1, y: this.startY-0.1, z: this.startZ+0.01, 
	        width: 0.02, height: 0.02, depth: 0.02,
	        red: 195, green: 204, blue: 203
	    });

	    var screwbox_top = new Box({
	        x: this.startX, y: this.startY+0.175, z: this.startZ-0.15, 
	        width: 0.04, height: 0.05, depth: 0.04,
	        asset: "magnemite_face_screwtop_box"
	    });

	    // face screws
	    var face_screw_left_front = new Plane({
	        x: this.startX-0.1, y: this.startY-0.1, z: this.startZ+0.04, 
	        width: 0.06, height: 0.06, 
	        asset: "magnemite_face_screw"
	    });

	    var face_screw_right_front = new Plane({
	        x: this.startX+0.1, y: this.startY-0.1, z: this.startZ+0.04, 
	        width: 0.06, height: 0.06, 
	        asset: "magnemite_face_screw"
	    });

	    var face_screw_left_back = new Plane({
	        x: this.startX-0.1, y: this.startY-0.1, z: this.startZ+0.02, 
	        width: 0.06, height: 0.06, rotationY: 180,
	        red: 195, green: 204, blue: 203 
	    });

	    var face_screw_right_back = new Plane({
	        x: this.startX+0.1, y: this.startY-0.1, z: this.startZ+0.02, 
	        width: 0.06, height: 0.06, rotationY: 180,
	        red: 195, green: 204, blue: 203 
	    });

	    var face_screw_left_left = new Plane({
	        x: this.startX-0.13, y: this.startY-0.1, z: this.startZ+0.03, 
	        width: 0.02, height: 0.06, rotationY: -90,
	        red: 195, green: 204, blue: 203 
	    });

	    var face_screw_right_left = new Plane({
	        x: this.startX+0.07, y: this.startY-0.1, z: this.startZ+0.03, 
	        width: 0.02, height: 0.06, rotationY: -90,
	        red: 195, green: 204, blue: 203 
	    });

	    var face_screw_left_right = new Plane({
	        x: this.startX-0.07, y: this.startY-0.1, z: this.startZ+0.03, 
	        width: 0.02, height: 0.06, rotationY: 90,
	        red: 195, green: 204, blue: 203 
	    });

	    var face_screw_right_right = new Plane({
	        x: this.startX+0.13, y: this.startY-0.1, z: this.startZ+0.03, 
	        width: 0.02, height: 0.06, rotationY: 90,
	        red: 195, green: 204, blue: 203 
	    });

	    var face_screw_left_top = new Plane({
	        x: this.startX-0.1, y: this.startY-0.07, z: this.startZ+0.03, 
	        width: 0.06, height: 0.02, rotationX: -90,
	        red: 195, green: 204, blue: 203 
	    });

	    var face_screw_right_top = new Plane({
	        x: this.startX+0.1, y: this.startY-0.07, z: this.startZ+0.03, 
	        width: 0.06, height: 0.02, rotationX: -90,
	        red: 195, green: 204, blue: 203 
	    });

	    var face_screw_left_bottom = new Plane({
	        x: this.startX-0.1, y: this.startY-0.13, z: this.startZ+0.03, 
	        width: 0.06, height: 0.02, rotationX: 90,
	        red: 195, green: 204, blue: 203 
	    });

	    var face_screw_right_bottom = new Plane({
	        x: this.startX+0.1, y: this.startY-0.13, z: this.startZ+0.03, 
	        width: 0.06, height: 0.02, rotationX: 90,
	        red: 195, green: 204, blue: 203 
	    });

	    var head_screw_top = new Plane({
	        x: this.startX, y: this.startY+0.25, z: this.startZ-0.15, 
	        width: 0.15, height: 0.15, rotationX: -90,
	        asset: "magnemite_top_screw"
	    });

	    var head_screw_bottom = new Plane({
	        x: this.startX, y: this.startY+0.2, z: this.startZ-0.15, 
	        width: 0.15, height: 0.15, rotationX: 90,
	        red: 195, green: 204, blue: 203 
	    });

	    var head_screw_front = new Plane({
	        x: this.startX, y: this.startY+0.225, z: this.startZ-0.075, 
	        width: 0.15, height: 0.05,
	        red: 195, green: 204, blue: 203 
	    });

	    var head_screw_back = new Plane({
	        x: this.startX, y: this.startY+0.225, z: this.startZ-0.225, 
	        width: 0.15, height: 0.05, rotationY: 180,
	        red: 195, green: 204, blue: 203 
	    });

	    var head_screw_left = new Plane({
	        x: this.startX-0.075, y: this.startY+0.225, z: this.startZ-0.15, 
	        width: 0.15, height: 0.05, rotationY: -90,
	        red: 195, green: 204, blue: 203 
	    });

	    var head_screw_right = new Plane({
	        x: this.startX+0.075, y: this.startY+0.225, z: this.startZ-0.15, 
	        width: 0.15, height: 0.05, rotationY: 90,
	        red: 195, green: 204, blue: 203 
	    });

	    // magnets
	    var magnet_left_bottom = new Box({
	        x: this.startX-0.185, y: this.startY, z: this.startZ-0.15, 
	        width: 0.07, height: 0.23, depth: 0.07,
	        red: 190, green: 196, blue: 188 
	    });

	    var magnet_right_bottom = new Box({
	        x: this.startX+0.185, y: this.startY, z: this.startZ-0.15, 
	        width: 0.07, height: 0.23, depth: 0.07,
	        red: 190, green: 196, blue: 188 
	    });

	    var magnet_left_upper = new Box({
	        x: this.startX-0.27, y: this.startY+0.08, z: this.startZ-0.15, 
	        width: 0.11, height: 0.07, depth: 0.07,
	        red: 190, green: 196, blue: 188 
	    });

	    var magnet_left_lower = new Box({
	        x: this.startX-0.27, y: this.startY-0.08, z: this.startZ-0.15, 
	        width: 0.11, height: 0.07, depth: 0.07,
	        red: 190, green: 196, blue: 188 
	    });

	    var magnet_right_upper = new Box({
	        x: this.startX+0.27, y: this.startY+0.08, z: this.startZ-0.15, 
	        width: 0.11, height: 0.07, depth: 0.07,
	        red: 190, green: 196, blue: 188 
	    });

	    var magnet_right_lower = new Box({
	        x: this.startX+0.27, y: this.startY-0.08, z: this.startZ-0.15, 
	        width: 0.1, height: 0.07, depth: 0.07,
	        red: 190, green: 196, blue: 188 
	    });

	    var magnet_blue_left = new Box({
	        x: this.startX-0.355, y: this.startY-0.08, z: this.startZ-0.15, 
	        width: 0.07, height: 0.07, depth: 0.07,
	        red: 97, green: 167, blue: 198 
	    });

	    var magnet_blue_right = new Box({
	        x: this.startX+0.355, y: this.startY+0.08, z: this.startZ-0.15, 
	        width: 0.07, height: 0.07, depth: 0.07,
	        red: 186, green: 139, blue: 128 
	    });

	     var magnet_red_left = new Box({
	        x: this.startX-0.355, y: this.startY+0.08, z: this.startZ-0.15, 
	        width: 0.07, height: 0.07, depth: 0.07,
	        red: 186, green: 139, blue: 128 
	    });

	    var magnet_red_right = new Box({
	        x: this.startX+0.355, y: this.startY-0.08, z: this.startZ-0.15, 
	        width: 0.07, height: 0.07, depth: 0.07,
	        red: 97, green: 167, blue: 198 
	    });

	    this.sensor = new Box({
	      x: this.startX , y: this.startY, z: this.startZ + 0.5,
	      width: 0.1, height: 0.1, depth: 0.1,
	      red: 0, green: 255, blue: 0,
	      opacity: boxOpacity
	    });

		// add the different components of the Pokemon
		// magnemite's body
	    this.container.addChild(face);
	    this.container.addChild(back);
	    this.container.addChild(left);
	    this.container.addChild(right);
	    this.container.addChild(head);
	    this.container.addChild(bottom);

	    // magnemite's screws
	    this.container.addChild(screwbox_left);
	    this.container.addChild(screwbox_right);
	    this.container.addChild(screwbox_top);

	    this.container.addChild(face_screw_left_front);
	    this.container.addChild(face_screw_right_front);
	    this.container.addChild(face_screw_left_back);
	    this.container.addChild(face_screw_right_back);
	    this.container.addChild(face_screw_left_left);
	    this.container.addChild(face_screw_right_left);
	    this.container.addChild(face_screw_left_right);
	    this.container.addChild(face_screw_right_right);
	    this.container.addChild(face_screw_left_top);
	    this.container.addChild(face_screw_right_top);
	    this.container.addChild(face_screw_left_bottom);
	    this.container.addChild(face_screw_right_bottom);

	    this.container.addChild(head_screw_top);
	    this.container.addChild(head_screw_bottom);
	    this.container.addChild(head_screw_front);
	    this.container.addChild(head_screw_back);
	    this.container.addChild(head_screw_left);
	    this.container.addChild(head_screw_right);
	    this.container.addChild(head_screw_right);

	    // magnemite's magnets
	    this.container.addChild(magnet_left_bottom);
	    this.container.addChild(magnet_right_bottom);
	    this.container.addChild(magnet_left_upper);
	    this.container.addChild(magnet_left_lower);
	    this.container.addChild(magnet_right_upper);
	    this.container.addChild(magnet_right_lower);
	    this.container.addChild(magnet_blue_left);
	    this.container.addChild(magnet_blue_right);
	    this.container.addChild(magnet_red_left);
	    this.container.addChild(magnet_red_right);

	    // get all the entities of the container 
    	this.containerArray = this.container.getChildren();

    	this.container.addChild(this.sensor);

	    // get all the entities of the container 
    	this.containerArray = this.container.getChildren();

    	// perlin noise offset
    	this.noiseOffset = random(10000);
    	this.noiseOffset2 = random(20000);
	}

	animate() {

		this.animationCounter += 1;

		// 28 - 37
		this.containerArray[28].setZ(this.initialZ1-0.15 + this.moveValue);
		this.containerArray[29].setZ(this.initialZ2-0.15 - this.moveValue);
		this.containerArray[30].setZ(this.initialZ1-0.15 + this.moveValue);
		this.containerArray[31].setZ(this.initialZ1-0.15 + this.moveValue);
		this.containerArray[32].setZ(this.initialZ2-0.15 - this.moveValue);
		this.containerArray[33].setZ(this.initialZ2-0.15 - this.moveValue);
		this.containerArray[34].setZ(this.initialZ1-0.15 + this.moveValue);
		this.containerArray[35].setZ(this.initialZ2-0.15 - this.moveValue);
		this.containerArray[36].setZ(this.initialZ1-0.15 + this.moveValue);
		this.containerArray[37].setZ(this.initialZ2-0.15 - this.moveValue);

		this.initialZ1 += this.moveValue;
		this.initialZ2 -= this.moveValue;

		if (this.animationCounter === 40) {
			this.moveValue *= -1;
			this.animationCounter = 0;
		}

		this.blinkCounter += 1;

		if (this.blinkCounter >= this.blinkTime) {
	        this.containerArray[0].setAsset("magnemite_face_blink");
	        if (this.blinkCounter == this.blinkTime + 15) {
	            this.containerArray[0].setAsset("magnemite_face");
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
	    
	    var yDiff = map(noise(this.noiseOffset2), 0, 1, -1, 1);
	    this.noiseOffset2 += 0.01;

	    // nudge the container toward this position
	    this.container.nudge(xDiff * this.speed, yDiff * this.speedY, zDiff * this.speed);
	    this.container.constrainPosition(-xConstrain, xConstrain, 1.5, 3, -zConstrain, zConstrain);
	}
 }
