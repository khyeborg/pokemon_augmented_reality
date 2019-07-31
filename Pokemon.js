class Pokemon {
	
	constructor(pokemonName, shadow, startX, startY, startZ, shinyNum, baby) {

		this.container = new Container3D({x: startX, y: startY, z: startZ, rotationY: 0, scaleX: 0, scaleY: 0, scaleZ: 0});
		
		// identity 
		this.pokemonName = pokemonName;

		// coordinates
		this.startX = 0;
		this.startY = 0;
		this.startZ = 0;
		this.yConstrain = startY;

		// speed
		this.speed = 0.04;

		// blinking
		this.blinkCounter = Math.floor(random(0, 100));
		this.blinkTime = Math.floor(random(100, 120));

		// perlin noise offset
    	this.noiseOffset = random(10000);
    	this.turning = false;
    	this.turnChance = Math.floor(random(0, 2));

    	// grow factor 
    	this.growCounter = 0;
    	this.growFactor = 1;
    	this.growAmount = 1; 

    	// reproduction
    	this.layBabiesCounter = 0;
    	this.pregnant = false;
    	this.eggRotation =  Math.floor(random(0, 360));
    	this.eggAdded = false;
    	this.baby = baby;

    	// fall
    	if (this.baby == false) {this.scale = 0; this.fallen = false;}
    	else {this.scale = 0.5; this.fallen = true;}

    	// shiny
    	this.shinyNum = shinyNum;
    	if (this.shinyNum > shinyChanceNum) {this.shiny = false; this.layBabiesTime = Math.floor(random(layBabiesTimeLower, layBabiesTimeUpper));}
    	else {this.shiny = true; this.layBabiesTime = Math.floor(random(layBabiesTimeLowerShiny, layBabiesTimeUpperShiny));}

		// pokemon specific variables
		if (this.pokemonName == "poliwag") {
			// animation
			this.leftLegRotateCounter = 0;
			this.rightLegRotateCounter = 0;
			this.leftLegRotateDirection = 1;
			this.rightLegRotateDirection = 1;
			this.tailRotateCounter = 0;
			this.tailRotateDirection = 1;

			// egg
			this.eggY = 0.4;
			this.eggZ = -0.35;

			// shadow
			this.shadow = [83, 131, 197];
			this.shadowRed = this.shadow[0];
			this.shadowGreen = this.shadow[1];
			this.shadowBlue = this.shadow[2];

			// marker
			this.markerPosY = 0.3;
		}

		else if (this.pokemonName == "diglett") {
			// animation
			this.initialY = this.startY;
			this.downValue = -0.0012;

			// egg
			this.eggY = 0.35;
			this.eggZ = -0.3;

			// shadow
			this.shadow = [0, 0, 0];
			this.shadowRed = this.shadow[0];
			this.shadowGreen = this.shadow[1];
			this.shadowBlue = this.shadow[2];

			// marker
			this.markerPosY = 0.35;
		}

		else if (this.pokemonName == "bulbasaur") {
			// animation
			this.animationCounter = 0;
			this.animationCounter2 = 99;
			this.forwardValue = 0.00075;

			this.eggY = 0.4;
			this.eggZ = -0.2;

			// shadow
			this.shadow = [116, 178, 108];
			this.shadowRed = this.shadow[0];
			this.shadowGreen = this.shadow[1];
			this.shadowBlue = this.shadow[2];

			// marker
			this.markerPosY = 0.25;
		}

		else if (this.pokemonName == "magnemite") {
			// animation
			this.initialZ1 = 0;
			this.initialZ2 = 0;
			this.animationCounter = 0;
			this.moveValue = 0.001;

			// speed
			this.speedY = 0.01;

			// perlin noise offset
    		this.noiseOffset2 = random(20000);

    		this.eggY = 0.35;
			this.eggZ = -0.3;

			// shadow
			this.shadow = [0, 0, 0];
			this.shadowRed = this.shadow[0];
			this.shadowGreen = this.shadow[1];
			this.shadowBlue = this.shadow[2];

			// marker
			this.markerPosY = 0.8;
		}

		else if (this.pokemonName == "pikachu") {
			// animation
			this.animationCounter = 0;
			this.animationCounter2 = 99;
			this.forwardValue = 0.00075;

			this.eggY = 0.55;
			this.eggZ = -0.2;

			// shadow
			this.shadow = [0, 0, 0];
			this.shadowRed = this.shadow[0];
			this.shadowGreen = this.shadow[1];
			this.shadowBlue = this.shadow[2];

			// marker
			this.markerPosY = 0.295;
		}

		else if (this.pokemonName == "slowpoke") {
			// animation
			this.leftLegRotateCounter = 0;
			this.rightLegRotateCounter = 0;
			this.leftLegRotateDirection = 1;
			this.rightLegRotateDirection = 1;

			this.eggY = 0.3;
			this.eggZ = -0.2;

			// shadow
			this.shadow = [0, 0, 0];
			this.shadowRed = this.shadow[0];
			this.shadowGreen = this.shadow[1];
			this.shadowBlue = this.shadow[2];

			// marker
			this.markerPosY = 0.15;
		}

		// build the Pokemon
		if (this.shiny == false) {
			this.build();
			this.container.addChild(this.sensor); 
			if(drawShadow == true) {this.container.addChild(this.shadow);}
		}
		else if (this.shiny == true) {
			this.buildShiny();
			this.container.addChild(this.sensor);
			if(drawShadow == true) {this.container.addChild(this.shadow);}
		}

		// add the egg
		this.egg = new OBJ({
	        asset: 'egg_obj',
	        mtl: 'egg_mtl',
	        x: this.startX, y: this.startY+this.eggY, z: this.startZ,
	        rotationX: -90,
	        scaleX: eggScale, scaleY: eggScale, scaleZ: eggScale
	    });

	    this.container.addChild(this.egg);

	    // get all the entities of the container 
    	this.containerArray = this.container.getChildren();
	}

	computeShadow() {

	}

	layBabies() {
		this.layBabiesCounter++;

		if (this.layBabiesCounter > this.layBabiesTime - pregnantTime) {this.pregnant = true;}

		if (this.layBabiesCounter == this.layBabiesTime) {
			// shiny Pokemons only give birth to shiny Pokemons
			if (this.shiny == true) {
				var twinChance = Math.floor(random(1, 21));
				if (twinChance <= 19) {
					if (this.pokemonName == "magnemite") {
						var temp = new Pokemon(this.pokemonName, this.shadow, this.container.getX(), this.container.getY() * scaleFactor, this.container.getZ(), this.shinyNum, true);
			            staticContainer.addChild(temp.container);
			            pokemons.push(temp);
					}
					else {
						var temp = new Pokemon(this.pokemonName, this.shadow, this.container.getX(), this.container.getY() * scaleFactor, this.container.getZ(), this.shinyNum, true);
			            staticContainer.addChild(temp.container);
			            pokemons.push(temp);
					}
				}
				else {
					// twins
					if (this.pokemonName == "magnemite") {
						var temp = new Pokemon(this.pokemonName, this.shadow, this.container.getX(), this.container.getY() * scaleFactor, this.container.getZ(), this.shinyNum, true);
			            staticContainer.addChild(temp.container); pokemons.push(temp);					
						var temp = new Pokemon(this.pokemonName, this.shadow, this.container.getX(), this.container.getY() * scaleFactor, this.container.getZ(), this.shinyNum, true);
			            staticContainer.addChild(temp.container); pokemons.push(temp);					
					}
					else {
						var temp = new Pokemon(this.pokemonName, this.shadow, this.container.getX(), this.container.getY() * scaleFactor, this.container.getZ(), this.shinyNum, true);
			            staticContainer.addChild(temp.container); pokemons.push(temp);
						var temp = new Pokemon(this.pokemonName, this.shadow, this.container.getX(), this.container.getY() * scaleFactor, this.container.getZ(), this.shinyNum, true);
			            staticContainer.addChild(temp.container); pokemons.push(temp);
					}
				}
				this.layBabiesTime = Math.floor(random(layBabiesTimeLowerShiny, layBabiesTimeUpperShiny));
			}
			// normal Pokemons can give birth to normal or shiny Pokemons
			else {
				var twinChance = Math.floor(random(1, 21));
				if (twinChance <= 19) {
					if (this.pokemonName == "magnemite") {
						var temp = new Pokemon(this.pokemonName, this.shadow, this.container.getX(), this.container.getY() * scaleFactor, this.container.getZ(), Math.floor(random(1, 101)), true);
			            staticContainer.addChild(temp.container); pokemons.push(temp);
					}
					else {
						var temp = new Pokemon(this.pokemonName, this.shadow, this.container.getX(), this.container.getY() * scaleFactor, this.container.getZ(), Math.floor(random(1, 101)), true);
			            staticContainer.addChild(temp.container); pokemons.push(temp);
					}
				}
				else {
					// twins
					if (this.pokemonName == "magnemite") {
						var temp = new Pokemon(this.pokemonName, this.shadow, this.container.getX(), this.container.getY() * scaleFactor, this.container.getZ(), Math.floor(random(1, 101)), true);
			            staticContainer.addChild(temp.container);
			            pokemons.push(temp);					
						var temp = new Pokemon(this.pokemonName, this.shadow, this.container.getX(), this.container.getY() * scaleFactor, this.container.getZ(), Math.floor(random(1, 101)), true);
			            staticContainer.addChild(temp.container); pokemons.push(temp);					
					}
					else {
						var temp = new Pokemon(this.pokemonName, this.shadow, this.container.getX(), this.container.getY() * scaleFactor, this.container.getZ(), Math.floor(random(1, 101)), true);
			            staticContainer.addChild(temp.container); pokemons.push(temp);
						var temp = new Pokemon(this.pokemonName, this.shadow, this.container.getX(), this.container.getY() * scaleFactor, this.container.getZ(), Math.floor(random(1, 101)), true);
			            staticContainer.addChild(temp.container); pokemons.push(temp);
					}
				}
				this.layBabiesTime = Math.floor(random(layBabiesTimeLower, layBabiesTimeUpper));
			}
			this.layBabiesCounter = 0;
			this.pregnant = false;
		}
	}

	grow() {
		// do not let grow factor exceed 2.5
		if (this.growFactor >= maximumGrowth) {return maximumGrowth;}
		
		this.growCounter++;

		if (this.growCounter % 25 == 0) {
			this.growFactor += growthRate;
		}

		return this.growFactor;
	}

	move() {
		// sway a little with perlin noise
	    var swayAmount = map(noise(this.noiseOffset), 0, 1, -1, 1);
	    this.container.spinY(swayAmount);
	    this.noiseOffset += 0.01;

	    // compute the world position of our sensor (not the local position inside of our container)
	    var vectorHUD = new THREE.Vector3();
	    vectorHUD.setFromMatrixPosition(this.sensor.tag.object3D.matrixWorld);
	    vectorHUD = staticContainer.tag.object3D.worldToLocal(vectorHUD);

	    // now compute how far off we are from this position
	    var xDiff = vectorHUD.x - this.container.getX();
	    var zDiff = vectorHUD.z - this.container.getZ();

	    // nudge the container toward this position
	    if (this.pokemonName == "magnemite") {
	    	var yDiff = map(noise(this.noiseOffset2), 0, 1, -1, 1);
		    this.noiseOffset2 += 0.01;

		    // nudge the container toward this position
		    this.container.nudge(xDiff * this.speed, yDiff * this.speedY, zDiff * this.speed);
		    this.container.constrainPosition(-xConstrain, xConstrain, this.markerPosY * scaleFactor, 4 * this.markerPosY * scaleFactor, -zConstrain, zConstrain);
	    }
	    else {
	    	this.container.nudge(xDiff * this.speed, 0, zDiff * this.speed);
	    	this.container.constrainPosition(-xConstrain, xConstrain, this.markerPosY * scaleFactor, this.markerPosY * scaleFactor * 50, -zConstrain, zConstrain);
	    }

	    // turn around if Pokemons are at the borders 
	    if (this.container.getX() <= -xConstrain + 1 || this.container.getX() >= xConstrain - 1 || this.container.getZ() <= -zConstrain + 1 || this.container.getZ() >= zConstrain - 1) {
	    	if (this.turning = false) {
	    		this.turnChance = Math.floor(random(0, 2));
	    		this.turning = true;
	    	}
	    	if (this.turnChance == 0) {this.container.spinY(turnAmount);}
	    	else {this.container.spinY(-turnAmount);}
	    }
	    else {
	    	this.turning = false;
	    }
	}

	fall() {
		if (this.pokemonName == "magnemite") {
		    this.container.constrainPosition(-xConstrain, xConstrain, this.markerPosY * scaleFactor, 5 * this.markerPosY * scaleFactor, -zConstrain, zConstrain);
	    }
	    else {
	    	this.container.constrainPosition(-xConstrain, xConstrain, this.markerPosY * scaleFactor, this.markerPosY * scaleFactor * 50, -zConstrain, zConstrain);
	    }

		// Pokemons are small when they get instantiated 
	    if (this.scale < 0.5) {
	    	this.scale += 0.01;
	    	this.container.setScale(this.scale, this.scale, this.scale);
	    }
	    else {
		    // when the Pokemons get big enough, fall from the marker
		    if (this.fallen == false) {
			    if (this.container.getY() > this.markerPosY * scaleFactor) {
			    	this.container.nudge(0, -0.1, 0);
			    	if (this.container.getY() <= this.markerPosY * scaleFactor) {
			    		this.container.setY(this.markerPosY * scaleFactor);
			    		this.fallen = true;
			    	}
			    }
			}
		}
	}

	animate() {
		if (this.pokemonName == "poliwag") {
			this.containerArray[11].spinX(0.5 * -1 * this.leftLegRotateDirection); // position 11: Box for left leg
		    this.containerArray[12].spinX(-0.5 * -1 * this.rightLegRotateDirection); // position 12: Box for right leg
		    this.containerArray[13].spinX(0.3 * -1 * this.tailRotateDirection);
		    this.containerArray[14].spinX(0.3 * -1 * this.tailRotateDirection);
		    
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
		}
		else if (this.pokemonName == "diglett") {
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
			if (this.startY >= this.initialY) {
				this.downValue *= -1;
			}
		}
		else if (this.pokemonName == "bulbasaur") {
			this.animationCounter += 3;
			this.animationCounter2 += 3;

			if (this.animationCounter === 99) {
				this.containerArray[8].setZ(this.startZ-0.05 + 0.05);
				this.containerArray[11].setZ(this.startZ-0.45 + 0.05);
			}
			if (this.animationCounter === 201) {
				this.containerArray[8].setZ(this.startZ-0.05);
				this.containerArray[11].setZ(this.startZ-0.45);
				this.animationCounter = 0;
			}

			if (this.animationCounter2 === 99) {
				this.containerArray[9].setZ(this.startZ-0.05 + 0.05);
				this.containerArray[10].setZ(this.startZ-0.45 + 0.05);
			}
			if (this.animationCounter2 === 201) {
				this.containerArray[9].setZ(this.startZ-0.05);
				this.containerArray[10].setZ(this.startZ-0.45);
				this.animationCounter2 = 0;
			}
		}

		else if (this.pokemonName == "magnemite") {
			this.animationCounter += 1;

			// 28 - 37
			this.containerArray[28].setZ(this.initialZ1 + this.moveValue);
			this.containerArray[29].setZ(this.initialZ2 - this.moveValue);
			this.containerArray[30].setZ(this.initialZ1 + this.moveValue);
			this.containerArray[31].setZ(this.initialZ1 + this.moveValue);
			this.containerArray[32].setZ(this.initialZ2 - this.moveValue);
			this.containerArray[33].setZ(this.initialZ2 - this.moveValue);
			this.containerArray[34].setZ(this.initialZ1 + this.moveValue);
			this.containerArray[35].setZ(this.initialZ2 - this.moveValue);
			this.containerArray[36].setZ(this.initialZ1 + this.moveValue);
			this.containerArray[37].setZ(this.initialZ2 - this.moveValue);

			this.initialZ1 += this.moveValue;
			this.initialZ2 -= this.moveValue;

			if (this.animationCounter === 40) {
				this.moveValue *= -1;
				this.animationCounter = 0;
			}
		}

		else if (this.pokemonName == "pikachu") {
			this.animationCounter += 3;
			this.animationCounter2 += 3;

			if (this.animationCounter === 99) {
				this.containerArray[6].setZ(this.startZ-0.07 + 0.05);
				this.containerArray[8].setZ(this.startZ-0.46 + 0.05);
			}
			if (this.animationCounter === 201) {
				this.containerArray[6].setZ(this.startZ-0.07);
				this.containerArray[8].setZ(this.startZ-0.46);
				this.animationCounter = 0;
			}

			if (this.animationCounter2 === 99) {
				this.containerArray[7].setZ(this.startZ-0.07 + 0.05);
				this.containerArray[9].setZ(this.startZ-0.46 + 0.05);
			}
			if (this.animationCounter2 === 201) {
				this.containerArray[7].setZ(this.startZ-0.07);
				this.containerArray[9].setZ(this.startZ-0.46);
				this.animationCounter2 = 0;
			}
		}

		else if (this.pokemonName == "slowpoke") {
			// 7 - 10
			this.containerArray[7].spinX(0.3 * -1 * this.leftLegRotateDirection); // position 7: Box for left leg front
		    this.containerArray[8].spinX(-0.3 * -1 * this.rightLegRotateDirection); // position 8: Box for right leg front
		    this.containerArray[9].spinX(-0.3 * -1 * this.leftLegRotateDirection); // position 9: Box for left leg back
		    this.containerArray[10].spinX(0.3 * -1 * this.rightLegRotateDirection); // position 10: Box for right leg back
		    
		    this.leftLegRotateCounter += 1;
		    this.rightLegRotateCounter += 1;

		    if (this.leftLegRotateCounter == 110) {
		        this.leftLegRotateDirection *= -1;
		        this.leftLegRotateCounter = 0;
		    }

		    if (this.rightLegRotateCounter == 110) {
		        this.rightLegRotateDirection *= -1;
		        this.rightLegRotateCounter = 0;
		    }
		}

		// blinking
		this.blinkCounter += 1;
	    if (this.blinkCounter >= this.blinkTime) {
	    	if (this.shiny == false) {
		        this.containerArray[0].setAsset(this.pokemonName + "_face_blink");
		        if (this.blinkCounter == this.blinkTime + 15) {
		            this.containerArray[0].setAsset(this.pokemonName + "_face");
		            this.blinkTime = Math.floor(random(100, 120));
		            this.blinkCounter = 0;
		        }
		    }
		    else if (this.shiny == true) {
		        this.containerArray[0].setAsset("shiny_" + this.pokemonName + "_face_blink");
		        if (this.blinkCounter == this.blinkTime + 15) {
		            this.containerArray[0].setAsset("shiny_" + this.pokemonName + "_face");
		            this.blinkTime = Math.floor(random(100, 120));
		            this.blinkCounter = 0;
		        }
		    }
	    }


	    // rotate the egg
	    this.egg.rotateY(this.eggRotation++);
	}

	build() {
		if (this.pokemonName == "poliwag") {
			// face 
		    var face = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ+0.25, 
		        width: 0.5, height: 0.5,
		        asset: "poliwag_face"
		    });

		    // back 
		    var back = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ-0.1, 
		        width: 0.5, height: 0.5, rotationY: 180,
		        red:102, green:148, blue:207
		    });

		    // side left
		    var left = new Plane({
		        x: this.startX-0.25, y: this.startY, z: this.startZ+0.075, 
		        width: 0.35, height: 0.5, rotationY: -90,
		        red: 102, green: 148, blue: 207
		    });

		    // side right
		    var right = new Plane({
		        x: this.startX+0.25, y: this.startY, z: this.startZ+0.075, 
		        width: 0.35, height: 0.5, rotationY: 90,
		        red:102, green:148, blue:207
		    });

		    // head 
		    var head = new Plane({
		        x: this.startX, y: this.startY+0.25, z: this.startZ+0.075, 
		        width: 0.5, height: 0.35, rotationX: -90,
		        red:102, green:148, blue:207
		    });

		    // bottom 
		    var bottom = new Plane({
		        x: this.startX, y: this.startY-0.25, z: this.startZ+0.075, 
		        width: 0.5, height: 0.35, rotationX: 90,
		        red:102, green:148, blue:207
		    });

		    // mouth 
		    var mouth_front = new Plane({
		        x: this.startX, y: this.startY+0.03, z: this.startZ+0.3, 
		        width: 0.09, height: 0.06,
		        asset: "poliwag_mouth"
		    });

		    var mouth_top = new Plane({
		        x: this.startX, y: this.startY+0.06, z: this.startZ+0.275, 
		        width: 0.09, height: 0.05, rotationX: -90,
		        red:241, green:200, blue:217
		    });

		    var mouth_bottom = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ+0.275, 
		        width: 0.09, height: 0.05, rotationX: 90,
		        red:241, green:200, blue:217,
		    });

		    var mouth_left = new Plane({
		        x: this.startX-0.045, y: this.startY+0.03, z: this.startZ+0.275, 
		        width: 0.05, height: 0.06, rotationY: -90,
		        red:241, green:200, blue:217
		    });

		    var mouth_right = new Plane({
		        x: this.startX+0.045, y: this.startY+0.03, z: this.startZ+0.275, 
		        width: 0.05, height: 0.06, rotationY: 90,
		        red:241, green:200, blue:217
		    });

		    // legs
		    var leg_left = new Box ({
		        x: this.startX-0.12, y: this.startY-0.275, z: this.startZ+0.17,
		        width: 0.1, height:0.05, depth:0.3,
		        red:102, green:148, blue:207
		    });

		    var leg_right = new Box ({
		        x: this.startX+0.12, y: this.startY-0.275, z: this.startZ+0.17,
		        width: 0.1, height:0.05, depth:0.3,
		        rotationX: -15,
		        red:102, green:148, blue:207
		    });

		    // tail
		    var tail_blue = new Box ({
		        x: this.startX, y: this.startY-0.1, z: this.startZ-0.1,
		        width: 0.05, height:0.05, depth:0.35,
		        red:102, green:148, blue:207
		    });

		    var tail_white = new Box ({
		        x: this.startX, y: this.startY-0.1, z: this.startZ-0.1,
		        width: 0.25, height:0.025, depth:0.65,
		        red:250, green:249, blue:246
		        //red:0, green:0, blue:0
		    });

		    this.sensor = new Box({
		      x: this.startX, y: this.startY, z: this.startZ + 0.25,
		      width: 0.1, height: 0.1, depth: 0.1,
		      red: 0, green: 255, blue: 0,
		      opacity: boxOpacity
		    });

		    this.shadow = new Plane
		    ({
		        x: this.startX, y: this.startY-0.295, z: this.startZ+0.12, 
		        width: 0.5, height: 0.45, rotationX: -90,
		        red: this.shadowRed, green: this.shadowGreen, blue: this.shadowBlue
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
		}

		else if (this.pokemonName == "diglett") {
			// face 
		    var face = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ+0.15, 
		        width: 0.3, height: 0.5,
		        asset: "diglett_face"
		    });

		    // back 
		    var back = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ-0.15, 
		        width: 0.3, height: 0.5, rotationY: 180,
		        red:182, green:148, blue:123
		    });

		    // side left
		    var left = new Plane({
		        x: this.startX-0.15, y: this.startY, z: this.startZ, 
		        width: 0.3, height: 0.5, rotationY: -90,
		        red:182, green:148, blue:123
		    });

		    // side right
		    var right = new Plane({
		        x: this.startX+0.15, y: this.startY, z: this.startZ, 
		        width: 0.3, height: 0.5, rotationY: 90,
		        red:182, green:148, blue:123
		    });

		    // head 
		    var head = new Plane({
		        x: this.startX, y: this.startY+0.25, z: this.startZ, 
		        width: 0.3, height: 0.3, rotationX: -90,
		        red:182, green:148, blue:123
		    });

		    // bottom 
		    var bottom = new Plane({
		        x: this.startX, y: this.startY-0.25, z: this.startZ, 
		        width: 0.3, height: 0.3, rotationX: 90,
		        red:182, green:148, blue:123
		    });

		    // nose 
		    var nose_front = new Plane({
		        x: this.startX, y: this.startY+0.025, z: this.startZ+0.2, 
		        width: 0.12, height: 0.07,
		        asset: "diglett_nose"
		    });

		    var nose_top = new Plane({
		        x: this.startX, y: this.startY+0.055, z: this.startZ+0.175, 
		        width: 0.12, height: 0.05, rotationX: -90,
		        red:228, green:174, blue:206
		    });

		    var nose_bottom = new Plane({
		        x: this.startX, y: this.startY-0.005, z: this.startZ+0.175, 
		        width: 0.12, height: 0.05, rotationX: 90,
		        red:228, green:174, blue:206
		    });

		    var nose_left = new Plane({
		        x: this.startX-0.06, y: this.startY+0.025, z: this.startZ+0.175, 
		        width: 0.05, height: 0.07, rotationY: -90,
		        red:228, green:174, blue:206
		    });

		    var nose_right = new Plane({
		        x: this.startX+0.06, y: this.startY+0.025, z: this.startZ+0.175, 
		        width: 0.05, height: 0.07, rotationY: 90,
		        red:228, green:174, blue:206
		    });

		    // ground 
		    var ground = new Box({
		    	x: this.startX, y: this.startY-0.3, z: this.startZ, 
		    	width: 0.5, height: 0.1, depth: 0.5,
		    	red:123, green:133, blue:125
		    });

		    // stones 
		    var stone1 = new Box({
		    	x: this.startX-0.15, y: this.startY-0.235, z: this.startZ+0.175, 
		    	width: 0.06, height: 0.03, depth: 0.05,
		    	red:183, green:204, blue:195
		    });

		    var stone2 = new Box({
		    	x: this.startX-0.19, y: this.startY-0.24, z: this.startZ, 
		    	width: 0.03, height: 0.02, depth: 0.03,
		    	red:183, green:204, blue:195
		    });

		    var stone3 = new Box({
		    	x: this.startX+0.2, y: this.startY-0.23, z: this.startZ+0.06, 
		    	width: 0.06, height: 0.04, depth: 0.06,
		    	red:183, green:204, blue:195
		    });

		    this.sensor = new Box({
		      x: this.startX , y: this.startY, z: this.startZ + 0.2,
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
		}

		else if (this.pokemonName == "bulbasaur") {
			// face 
		    var face_front = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ+0.1, 
		        width: 0.5, height: 0.3,
		        asset: "bulbasaur_face"
		    });

		    var face_back = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ-0.1, 
		        width: 0.5, height: 0.3, rotationY: 180,
		        red: 127, green: 228, blue: 186
		    });

		    var face_left = new Plane({
		        x: this.startX-0.25, y: this.startY, z: this.startZ, 
		        width: 0.2, height: 0.3, rotationY: -90,
		        red: 127, green: 228, blue: 186
		    });

		    var face_right = new Plane({
		        x: this.startX+0.25, y: this.startY, z: this.startZ, 
		        width: 0.2, height: 0.3, rotationY: 90,
		        red: 127, green: 228, blue: 186
		    });

		    var face_top = new Plane({
		        x: this.startX, y: this.startY+0.15, z: this.startZ, 
		        width: 0.5, height: 0.2, rotationX: -90,
		        asset: "bulbasaur_face_top"
		    });

		    var face_bottom = new Plane({
		        x: this.startX, y: this.startY-0.15, z: this.startZ, 
		        width: 0.5, height: 0.2, rotationX: 90,
		        red: 127, green: 228, blue: 186
		    });

		    var ear_left = new Box({
		        x: this.startX-0.19, y: this.startY+0.15+0.025, z: this.startZ, 
		        width: 0.12, height: 0.05, depth: 0.08,
		        red: 127, green: 228, blue: 186
		    });

		    var ear_right = new Box({
		        x: this.startX+0.19, y: this.startY+0.15+0.025, z: this.startZ, 
		        width: 0.12, height: 0.05, depth: 0.08,
		        red: 127, green: 228, blue: 186
		    });

		    // legs
		    var leg_front_left = new Box({
		        x: this.startX-0.15, y: this.startY-0.2, z: this.startZ-0.05, 
		        width: 0.1, height: 0.1, depth: 0.1,
		        red: 127, green: 228, blue: 186
		    });

		    var leg_front_right = new Box({
		        x: this.startX+0.15, y: this.startY-0.2, z: this.startZ-0.05, 
		        width: 0.1, height: 0.1, depth: 0.1,
		        red: 127, green: 228, blue: 186
		    });

		    var leg_back_left = new Box({
		        x: this.startX-0.15, y: this.startY-0.2, z: this.startZ-0.45, 
		        width: 0.1, height: 0.1, depth: 0.1,
		        red: 127, green: 228, blue: 186
		    });

		    var leg_back_right = new Box({
		        x: this.startX+0.15, y: this.startY-0.2, z: this.startZ-0.45, 
		        width: 0.1, height: 0.1, depth: 0.1,
		        red: 127, green: 228, blue: 186
		    });

		    // body
		    var body = new Box({
		        x: this.startX, y: this.startY-0.05, z: this.startZ-0.3, 
		        width: 0.4, height: 0.25, depth: 0.4,
		        asset: "bulbasaur_body"
		    });

		    // seed
		    var seed_front = new Plane({
		        x: this.startX, y: this.startY+0.185, z: this.startZ-0.1, 
		        width: 0.5, height: 0.22,
		        asset: "bulbasaur_seed_side"
		    });

		    var seed_back = new Plane({
		        x: this.startX, y: this.startY+0.185, z: this.startZ-0.55, 
		        width: 0.5, height: 0.22, rotationY: 180,
		        asset: "bulbasaur_seed_side"
		    });

		    var seed_left = new Plane({
		        x: this.startX-0.25, y: this.startY+0.185, z: this.startZ-0.325, 
		        width: 0.45, height: 0.22, rotationY: -90,
		        asset: "bulbasaur_seed_side2"
		    });

		    var seed_right = new Plane({
		        x: this.startX+0.25, y: this.startY+0.185, z: this.startZ-0.325, 
		        width: 0.45, height: 0.22, rotationY: 90,
		        asset: "bulbasaur_seed_side2"
		    });

		    var seed_top = new Plane({
		        x: this.startX, y: this.startY+0.295, z: this.startZ-0.325, 
		        width: 0.5, height: 0.45, rotationX: -90,
		        asset: "bulbasaur_seed_top"
		    });

		    var seed_bottom = new Plane({
		        x: this.startX, y: this.startY+0.075, z: this.startZ-0.325, 
		        width: 0.5, height: 0.45, rotationX: 90,
		        red: 124, green: 197, blue: 131
		    });

		    var seedtop_front = new Plane({
		        x: this.startX, y: this.startY+0.335, z: this.startZ-0.225, 
		        width: 0.2, height: 0.08,
		        asset: "bulbasaur_seedtop_side"
		    });

		    var seedtop_back = new Plane({
		        x: this.startX, y: this.startY+0.335, z: this.startZ-0.425, 
		        width: 0.2, height: 0.08, rotationY: 180,
		        asset: "bulbasaur_seedtop_side"
		    });

		    var seedtop_left = new Plane({
		        x: this.startX-0.1, y: this.startY+0.335, z: this.startZ-0.325, 
		        width: 0.2, height: 0.08, rotationY: -90,
		        asset: "bulbasaur_seedtop_side"
		    });

		    var seedtop_right = new Plane({
		        x: this.startX+0.1, y: this.startY+0.335, z: this.startZ-0.325, 
		        width: 0.2, height: 0.08, rotationY: 90,
		        asset: "bulbasaur_seedtop_side"
		    });

		    var seedtop_top = new Plane({
		        x: this.startX, y: this.startY+0.375, z: this.startZ-0.325, 
		        width: 0.2, height: 0.2, rotationX: -90,
		        asset: "bulbasaur_seedtop_top"
		    });

		    this.sensor = new Box({
		      x: this.startX , y: this.startY, z: this.startZ + 0.6,
		      width: 0.1, height: 0.1, depth: 0.1,
		      red: 0, green: 255, blue: 0,
		      opacity: boxOpacity
		    });

		    this.shadow = new Plane
		    ({
		        x: this.startX, y: this.startY-0.245, z: this.startZ-0.2, 
		        width: 0.5, height: 0.65, rotationX: -90,
		        red: this.shadowRed, green: this.shadowGreen, blue: this.shadowBlue
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
		}

		else if (this.pokemonName == "magnemite") {
			// face 
		    var face = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ+0.15, 
		        width: 0.3, height: 0.3,
		        asset: "magnemite_face"
		    });

		    // back 
		    var back = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ-0.15, 
		        width: 0.3, height: 0.3, rotationY: 180,
		        red: 172, green: 205, blue: 212
		    });

		    // side left
		    var left = new Plane({
		        x: this.startX-0.15, y: this.startY, z: this.startZ, 
		        width: 0.3, height: 0.3, rotationY: -90,
		        red: 172, green: 205, blue: 212
		    });

		    // side right
		    var right = new Plane({
		        x: this.startX+0.15, y: this.startY, z: this.startZ, 
		        width: 0.3, height: 0.3, rotationY: 90,
		        red: 172, green: 205, blue: 212
		    });

		    // head 
		    var head = new Plane({
		        x: this.startX, y: this.startY+0.15, z: this.startZ, 
		        width: 0.3, height: 0.3, rotationX: -90,
		        red: 172, green: 205, blue: 212
		    });

		    // bottom 
		    var bottom = new Plane({
		        x: this.startX, y: this.startY-0.15, z: this.startZ, 
		        width: 0.3, height: 0.3, rotationX: 90,
		        red: 172, green: 205, blue: 212
		    });

		    // screw box
		    var screwbox_left = new Box({
		        x: this.startX-0.1, y: this.startY-0.1, z: this.startZ+0.16, 
		        width: 0.02, height: 0.02, depth: 0.02,
		        red: 195, green: 204, blue: 203
		    });

		    var screwbox_right = new Box({
		        x: this.startX+0.1, y: this.startY-0.1, z: this.startZ+0.16, 
		        width: 0.02, height: 0.02, depth: 0.02,
		        red: 195, green: 204, blue: 203
		    });

		    var screwbox_top = new Box({
		        x: this.startX, y: this.startY+0.175, z: this.startZ, 
		        width: 0.04, height: 0.05, depth: 0.04,
		        asset: "magnemite_face_screwtop_box"
		    });

		    // face screws
		    var face_screw_left_front = new Plane({
		        x: this.startX-0.1, y: this.startY-0.1, z: this.startZ+0.19, 
		        width: 0.06, height: 0.06, 
		        asset: "magnemite_face_screw"
		    });

		    var face_screw_right_front = new Plane({
		        x: this.startX+0.1, y: this.startY-0.1, z: this.startZ+0.19, 
		        width: 0.06, height: 0.06, 
		        asset: "magnemite_face_screw"
		    });

		    var face_screw_left_back = new Plane({
		        x: this.startX-0.1, y: this.startY-0.1, z: this.startZ+0.17, 
		        width: 0.06, height: 0.06, rotationY: 180,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_right_back = new Plane({
		        x: this.startX+0.1, y: this.startY-0.1, z: this.startZ+0.17, 
		        width: 0.06, height: 0.06, rotationY: 180,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_left_left = new Plane({
		        x: this.startX-0.13, y: this.startY-0.1, z: this.startZ+0.18, 
		        width: 0.02, height: 0.06, rotationY: -90,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_right_left = new Plane({
		        x: this.startX+0.07, y: this.startY-0.1, z: this.startZ+0.18, 
		        width: 0.02, height: 0.06, rotationY: -90,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_left_right = new Plane({
		        x: this.startX-0.07, y: this.startY-0.1, z: this.startZ+0.18, 
		        width: 0.02, height: 0.06, rotationY: 90,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_right_right = new Plane({
		        x: this.startX+0.13, y: this.startY-0.1, z: this.startZ+0.18, 
		        width: 0.02, height: 0.06, rotationY: 90,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_left_top = new Plane({
		        x: this.startX-0.1, y: this.startY-0.07, z: this.startZ+0.18, 
		        width: 0.06, height: 0.02, rotationX: -90,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_right_top = new Plane({
		        x: this.startX+0.1, y: this.startY-0.07, z: this.startZ+0.18, 
		        width: 0.06, height: 0.02, rotationX: -90,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_left_bottom = new Plane({
		        x: this.startX-0.1, y: this.startY-0.13, z: this.startZ+0.18, 
		        width: 0.06, height: 0.02, rotationX: 90,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_right_bottom = new Plane({
		        x: this.startX+0.1, y: this.startY-0.13, z: this.startZ+0.18, 
		        width: 0.06, height: 0.02, rotationX: 90,
		        red: 195, green: 204, blue: 203 
		    });

		    var head_screw_top = new Plane({
		        x: this.startX, y: this.startY+0.25, z: this.startZ, 
		        width: 0.15, height: 0.15, rotationX: -90,
		        asset: "magnemite_top_screw"
		    });

		    var head_screw_bottom = new Plane({
		        x: this.startX, y: this.startY+0.2, z: this.startZ, 
		        width: 0.15, height: 0.15, rotationX: 90,
		        red: 195, green: 204, blue: 203 
		    });

		    var head_screw_front = new Plane({
		        x: this.startX, y: this.startY+0.225, z: this.startZ+0.075, 
		        width: 0.15, height: 0.05,
		        red: 195, green: 204, blue: 203 
		    });

		    var head_screw_back = new Plane({
		        x: this.startX, y: this.startY+0.225, z: this.startZ-0.075, 
		        width: 0.15, height: 0.05, rotationY: 180,
		        red: 195, green: 204, blue: 203 
		    });

		    var head_screw_left = new Plane({
		        x: this.startX-0.075, y: this.startY+0.225, z: this.startZ, 
		        width: 0.15, height: 0.05, rotationY: -90,
		        red: 195, green: 204, blue: 203 
		    });

		    var head_screw_right = new Plane({
		        x: this.startX+0.075, y: this.startY+0.225, z: this.startZ, 
		        width: 0.15, height: 0.05, rotationY: 90,
		        red: 195, green: 204, blue: 203 
		    });

		    // magnets
		    var magnet_left_bottom = new Box({
		        x: this.startX-0.185, y: this.startY, z: this.startZ, 
		        width: 0.07, height: 0.23, depth: 0.07,
		        red: 190, green: 196, blue: 188 
		    });

		    var magnet_right_bottom = new Box({
		        x: this.startX+0.185, y: this.startY, z: this.startZ, 
		        width: 0.07, height: 0.23, depth: 0.07,
		        red: 190, green: 196, blue: 188 
		    });

		    var magnet_left_upper = new Box({
		        x: this.startX-0.27, y: this.startY+0.08, z: this.startZ, 
		        width: 0.11, height: 0.07, depth: 0.07,
		        red: 190, green: 196, blue: 188 
		    });

		    var magnet_left_lower = new Box({
		        x: this.startX-0.27, y: this.startY-0.08, z: this.startZ, 
		        width: 0.11, height: 0.07, depth: 0.07,
		        red: 190, green: 196, blue: 188 
		    });

		    var magnet_right_upper = new Box({
		        x: this.startX+0.27, y: this.startY+0.08, z: this.startZ, 
		        width: 0.11, height: 0.07, depth: 0.07,
		        red: 190, green: 196, blue: 188 
		    });

		    var magnet_right_lower = new Box({
		        x: this.startX+0.27, y: this.startY-0.08, z: this.startZ, 
		        width: 0.1, height: 0.07, depth: 0.07,
		        red: 190, green: 196, blue: 188 
		    });

		    var magnet_blue_left = new Box({
		        x: this.startX-0.355, y: this.startY-0.08, z: this.startZ, 
		        width: 0.07, height: 0.07, depth: 0.07,
		        red: 97, green: 167, blue: 198 
		    });

		    var magnet_red_left = new Box({
		        x: this.startX-0.355, y: this.startY+0.08, z: this.startZ, 
		        width: 0.07, height: 0.07, depth: 0.07,
		        red: 186, green: 139, blue: 128 
		    });

		    var magnet_red_right = new Box({
		        x: this.startX+0.355, y: this.startY-0.08, z: this.startZ, 
		        width: 0.07, height: 0.07, depth: 0.07,
		        red: 186, green: 139, blue: 128 
		    });

		    var magnet_blue_right = new Box({
		        x: this.startX+0.355, y: this.startY+0.08, z: this.startZ, 
		        width: 0.07, height: 0.07, depth: 0.07,
		        red: 97, green: 167, blue: 198 
		    });

		    this.sensor = new Box({
		      x: this.startX , y: this.startY, z: this.startZ + 0.65,
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
		}

		else if (this.pokemonName == "pikachu") {
			// face 
		    var face = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ+0.08, 
		        width: 0.5, height: 0.35,
		        asset: "pikachu_face"
		    });

		    var back = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ-0.52, 
		        width: 0.5, height: 0.35, rotationY: 180,
		        red: 246, green: 221, blue: 121
		    });

		    var left = new Plane({
		        x: this.startX-0.25, y: this.startY, z: this.startZ-0.22, 
		        width: 0.6, height: 0.35, rotationY: -90,
		        asset: "pikachu_left"
		    });

		    var right = new Plane({
		        x: this.startX+0.25, y: this.startY, z: this.startZ-0.22, 
		        width: 0.6, height: 0.35, rotationY: 90,
		        asset: "pikachu_right"
		    });

		    var top = new Plane({
		        x: this.startX, y: this.startY+0.175, z: this.startZ-0.22, 
		        width: 0.5, height: 0.6, rotationX: -90,
		        asset: "pikachu_top"
		    });

		    var bottom = new Plane({
		        x: this.startX, y: this.startY-0.175, z: this.startZ-0.22, 
		        width: 0.5, height: 0.6, rotationX: 90,
		        red: 246, green: 221, blue: 121
		    });

		    // legs
		    var leg_front_left = new Box({
		        x: this.startX-0.13, y: this.startY-0.235, z: this.startZ-0.07, 
		        width: 0.12, height: 0.12, depth: 0.12,
		        red: 246, green: 221, blue: 121
		    });

		    var leg_front_right = new Box({
		        x: this.startX+0.13, y: this.startY-0.235, z: this.startZ-0.07, 
		        width: 0.12, height: 0.12, depth: 0.12,
		        red: 246, green: 221, blue: 121
		    });

		    var leg_back_left = new Box({
		        x: this.startX-0.13, y: this.startY-0.235, z: this.startZ-0.46, 
		        width: 0.12, height: 0.12, depth: 0.12,
		        red: 246, green: 221, blue: 121
		    });

		    var leg_back_right = new Box({
		        x: this.startX+0.13, y: this.startY-0.235, z: this.startZ-0.46, 
		        width: 0.12, height: 0.12, depth: 0.12,
		        red: 246, green: 221, blue: 121
		    });

		    // ears 
		    var ear_left = new Box({
		        x: this.startX-0.12, y: this.startY+0.26, z: this.startZ, 
		        width: 0.13, height: 0.23, depth: 0.06,
		        //rotationX: -10,
		        red: 246, green: 221, blue: 121
		    });

		    var ear_right = new Box({
		        x: this.startX+0.12, y: this.startY+0.26, z: this.startZ, 
		        width: 0.13, height: 0.23, depth: 0.06,
		        //rotationX: -10,
		        red: 246, green: 221, blue: 121
		    });

		    var ear_left_top = new Box({
		        x: this.startX-0.12, y: this.startY+0.425, z: this.startZ, 
		        width: 0.13, height: 0.1, depth: 0.06,
		        //rotationX: -10,
		        red: 34, green: 35, blue: 33
		    });

		    var ear_right_top = new Box({
		        x: this.startX+0.12, y: this.startY+0.425, z: this.startZ, 
		        width: 0.13, height: 0.1, depth: 0.06,
		        //rotationX: -10,
		        red: 34, green: 35, blue: 33
		    });

		    // tail
		    var tail_bottom = new Box({
		        x: this.startX, y: this.startY+0.19, z: this.startZ-0.53, 
		        width: 0.08, height: 0.22, depth: 0.02,
		        rotationZ: -50,
		        red: 157, green: 127, blue: 91
		    });

		    var tail_middle = new Box({
		        x: this.startX, y: this.startY+0.32, z: this.startZ-0.53, 
		        width: 0.12, height: 0.28, depth: 0.02,
		        rotationZ: -50,
		        red: 246, green: 221, blue: 121
		    });

		    var tail_top = new Box({
		        x: this.startX+0.04, y: this.startY+0.49, z: this.startZ-0.53, 
		        width: 0.2, height: 0.32, depth: 0.02,
		        rotationZ: -50,
		        red: 246, green: 221, blue: 121
		    });

		    this.sensor = new Box({
		      x: this.startX , y: this.startY, z: this.startZ + 0.58,
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
		}

		else if (this.pokemonName == "slowpoke") {
			// face 
		    var face_front = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ+0.075, 
		        width: 0.3, height: 0.3,
		        asset: "slowpoke_face"
		    });

		    var face_back = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ-0.075, 
		        width: 0.3, height: 0.3, rotationY: 180,
		        red: 218, green: 162, blue: 175
		    });

		    var face_left = new Plane({
		        x: this.startX-0.15, y: this.startY, z: this.startZ, 
		        width: 0.15, height: 0.3, rotationY: -90,
		        red: 218, green: 162, blue: 175
		    });

		    var face_right = new Plane({
		        x: this.startX+0.15, y: this.startY, z: this.startZ, 
		        width: 0.15, height: 0.3, rotationY: 90,
		        red: 218, green: 162, blue: 175
		    });

		    var face_top = new Plane({
		        x: this.startX, y: this.startY+0.15, z: this.startZ, 
		        width: 0.3, height: 0.15, rotationX: -90,
		        red: 218, green: 162, blue: 175
		    });

		    var face_bottom = new Plane({
		        x: this.startX, y: this.startY-0.15, z: this.startZ, 
		        width: 0.3, height: 0.15, rotationX: 90,
		        red: 218, green: 162, blue: 175
		    });

		    var body = new Box({
		        x: this.startX, y: this.startY+0.01, z: this.startZ-0.3, 
		        width: 0.4, height: 0.32, depth: 0.45,
		        red: 218, green: 162, blue: 175
		    });

		    var leg_front_left = new Box({
		        x: this.startX-0.25, y: this.startY-0.1, z: this.startZ-0.075, 
		        width: 0.1, height: 0.1, depth: 0.16,
		        red: 218, green: 162, blue: 175
		    });

		    var leg_front_right = new Box({
		        x: this.startX+0.25, y: this.startY-0.1, z: this.startZ-0.075, 
		        width: 0.1, height: 0.1, depth: 0.16,
		        rotationX: -30,
		        red: 218, green: 162, blue: 175
		    });

		    var leg_back_left = new Box({
		        x: this.startX-0.275, y: this.startY-0.075, z: this.startZ-0.415, 
		        width: 0.15, height: 0.15, depth: 0.22,
		        rotationX: -30,
		        red: 218, green: 162, blue: 175
		    });

		    var leg_back_right = new Box({
		        x: this.startX+0.275, y: this.startY-0.075, z: this.startZ-0.415, 
		        width: 0.15, height: 0.15, depth: 0.22,
		        red: 218, green: 162, blue: 175
		    });

		    // mouth
		    var mouth_top_front = new Plane({
		        x: this.startX, y: this.startY-0.05625, z: this.startZ+0.125, 
		        width: 0.2, height: 0.0625,
		        asset: "slowpoke_mouth_top"
		    });

		    var mouth_top_back = new Plane({
		        x: this.startX, y: this.startY-0.05625, z: this.startZ+0.075, 
		        width: 0.2, height: 0.0625,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_top_left = new Plane({
		        x: this.startX-0.1, y: this.startY-0.05625, z: this.startZ+0.1, 
		        width: 0.05, height: 0.0625, rotationY: -90,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_top_right = new Plane({
		        x: this.startX+0.1, y: this.startY-0.05625, z: this.startZ+0.1, 
		        width: 0.05, height: 0.0625, rotationY: 90,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_top_top = new Plane({
		        x: this.startX, y: this.startY-0.025, z: this.startZ+0.1, 
		        width: 0.2, height: 0.05, rotationX: -90,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_top_bottom = new Plane({
		        x: this.startX, y: this.startY-0.0875, z: this.startZ+0.1, 
		        width: 0.2, height: 0.05, rotationX: 90,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_bottom_front = new Plane({
		        x: this.startX, y: this.startY-0.11875, z: this.startZ+0.1, 
		        width: 0.2, height: 0.0625,
		        asset: "slowpoke_mouth_bottom"
		    });

		    var mouth_bottom_back = new Plane({
		        x: this.startX, y: this.startY-0.11875, z: this.startZ+0.075, 
		        width: 0.2, height: 0.0625,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_bottom_left = new Plane({
		        x: this.startX-0.1, y: this.startY-0.11875, z: this.startZ+0.0875, 
		        width: 0.025, height: 0.0625, rotationY: -90,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_bottom_right = new Plane({
		        x: this.startX+0.1, y: this.startY-0.11875, z: this.startZ+0.0875, 
		        width: 0.025, height: 0.0625, rotationY: 90,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_bottom_bottom = new Plane({
		        x: this.startX, y: this.startY-0.15, z: this.startZ+0.0875, 
		        width: 0.2, height: 0.025, rotationX: 90,
		        red: 217, green: 207, blue: 168
		    });

		    var tooth_left = new Box({
		        x: this.startX-0.065, y: this.startY-0.1+0.005, z: this.startZ+0.11, 
		        width: 0.015, height: 0.015, depth: 0.015,
		        red: 232, green: 232, blue: 235
		    });

		    var tooth_right = new Box({
		        x: this.startX+0.065, y: this.startY-0.1+0.005, z: this.startZ+0.11, 
		        width: 0.015, height: 0.015, depth: 0.015,
		        red: 232, green: 232, blue: 235
		    });

		    // ears 
		    var ear_left_front = new Plane({
		        x: this.startX-0.15, y: this.startY+0.16, z: this.startZ+0.05, 
		        width: 0.12, height: 0.12,
		        asset: "slowpoke_ear_left"
		    });

		    var ear_right_front = new Plane({
		        x: this.startX+0.15, y: this.startY+0.16, z: this.startZ+0.05, 
		        width: 0.12, height: 0.12,
		        asset: "slowpoke_ear_right"
		    });

		    var ear_left_back = new Plane({
		        x: this.startX-0.15, y: this.startY+0.16, z: this.startZ+0.01, 
		        width: 0.12, height: 0.12, rotationY: 180,
		        red: 218, green: 162, blue: 175
		    });

		    var ear_right_back = new Plane({
		        x: this.startX+0.15, y: this.startY+0.16, z: this.startZ+0.01, 
		        width: 0.12, height: 0.12, rotationY: 180,
		        red: 218, green: 162, blue: 175
		    });

		    var ear_left_left = new Plane({
		        x: this.startX-0.21, y: this.startY+0.16, z: this.startZ+0.02, 
		        width: 0.06, height: 0.12, rotationY: -90,
		        red: 218, green: 162, blue: 175
		    });

		    var ear_left_right = new Plane({
		        x: this.startX-0.09, y: this.startY+0.16, z: this.startZ+0.02, 
		        width: 0.06, height: 0.12, rotationY: 90,
		        red: 218, green: 162, blue: 175
		    });

		    var ear_right_left = new Plane({
		        x: this.startX+0.09, y: this.startY+0.16, z: this.startZ+0.02, 
		        width: 0.06, height: 0.12, rotationY: -90,
		        red: 218, green: 162, blue: 175
		    });

		    var ear_right_right = new Plane({
		        x: this.startX+0.21, y: this.startY+0.16, z: this.startZ+0.02, 
		        width: 0.06, height: 0.12, rotationY: 90,
		        red: 218, green: 162, blue: 175
		    });

		    var ear_left_top = new Plane({
		        x: this.startX-0.15, y: this.startY+0.22, z: this.startZ+0.02, 
		        width: 0.12, height: 0.06, rotationX: -90,
		        red: 218, green: 162, blue: 175
		    });

		    var ear_right_top = new Plane({
		        x: this.startX+0.15, y: this.startY+0.22, z: this.startZ+0.02, 
		        width: 0.12, height: 0.06, rotationX: -90,
		        red: 218, green: 162, blue: 175
		    });

		    var ear_left_bottom = new Plane({
		        x: this.startX-0.15, y: this.startY+0.1, z: this.startZ+0.02, 
		        width: 0.12, height: 0.06, rotationX: 90,
		        red: 218, green: 162, blue: 175
		    });

		    var ear_right_bottom = new Plane({
		        x: this.startX+0.15, y: this.startY+0.1, z: this.startZ+0.02, 
		        width: 0.12, height: 0.06, rotationX: 90,
		        red: 218, green: 162, blue: 175
		    });

		    var tail_bottom = new Box({
		        x: this.startX, y: this.startY+0.14, z: this.startZ-0.6, 
		        width: 0.12, height: 0.58, depth: 0.15,
		        red: 218, green: 162, blue: 175
		    });

		    var tail_middle = new Box({
		        x: this.startX, y: this.startY+0.01+0.25+0.11, z: this.startZ-0.525, 
		        width: 0.12, height: 0.12, depth: 0.2,
		        red: 218, green: 162, blue: 175
		    });

		    var tail_end = new Box({
		        x: this.startX, y: this.startY+0.01+0.25+0.11, z: this.startZ-0.365, 
		        width: 0.12, height: 0.12, depth: 0.12,
		        red: 255, green: 242, blue: 245
		    });

		    this.sensor = new Box({
		      x: this.startX , y: this.startY, z: this.startZ + 0.575,
		      width: 0.1, height: 0.1, depth: 0.1,
		      red: 0, green: 255, blue: 0,
		      opacity: boxOpacity
		    });

		    // add the different components of the Pokemon
			// slowpoke's face
		    this.container.addChild(face_front);
		    this.container.addChild(face_back);
		    this.container.addChild(face_left);
		    this.container.addChild(face_right);
		    this.container.addChild(face_top);
		    this.container.addChild(face_bottom);

		    // slowpoke's body
		    this.container.addChild(body);

		    // slowpoke's legs
		    this.container.addChild(leg_front_left);
		    this.container.addChild(leg_front_right);
		    this.container.addChild(leg_back_left);
		    this.container.addChild(leg_back_right);

		    // slowpoke's mouth
		    this.container.addChild(mouth_top_front);
		    this.container.addChild(mouth_top_back);
		    this.container.addChild(mouth_top_left);
		    this.container.addChild(mouth_top_right);
		    this.container.addChild(mouth_top_top);
		    this.container.addChild(mouth_top_bottom);
		    this.container.addChild(mouth_bottom_front);
		    this.container.addChild(mouth_bottom_back);
		    this.container.addChild(mouth_bottom_left);
		    this.container.addChild(mouth_bottom_right);
		    this.container.addChild(mouth_bottom_bottom);
		    this.container.addChild(tooth_left);
		    this.container.addChild(tooth_right);

		    // slowpoke's ears
		    this.container.addChild(ear_left_front);
		    this.container.addChild(ear_right_front);
		    this.container.addChild(ear_left_back);
		    this.container.addChild(ear_right_back);
		    this.container.addChild(ear_left_left);
		    this.container.addChild(ear_left_right);
		    this.container.addChild(ear_right_left);
		    this.container.addChild(ear_right_right);
		    this.container.addChild(ear_left_top);
		    this.container.addChild(ear_right_top);
		    this.container.addChild(ear_left_bottom);
		    this.container.addChild(ear_right_bottom);

		    // slowpoke's tail
		    this.container.addChild(tail_bottom);
		    this.container.addChild(tail_middle);
		    this.container.addChild(tail_end);
		}
	}

	buildShiny() {
		if (this.pokemonName == "poliwag") {
			// face 
		    var face = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ+0.25, 
		        width: 0.5, height: 0.5,
		        asset: "shiny_poliwag_face"
		    });

		    // back 
		    var back = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ-0.1, 
		        width: 0.5, height: 0.5, rotationY: 180,
		        red:102, green:188, blue:242
		    });

		    // side left
		    var left = new Plane({
		        x: this.startX-0.25, y: this.startY, z: this.startZ+0.075, 
		        width: 0.35, height: 0.5, rotationY: -90,
		        red:102, green:188, blue:242
		    });

		    // side right
		    var right = new Plane({
		        x: this.startX+0.25, y: this.startY, z: this.startZ+0.075, 
		        width: 0.35, height: 0.5, rotationY: 90,
		        red:102, green:188, blue:242
		    });

		    // head 
		    var head = new Plane({
		        x: this.startX, y: this.startY+0.25, z: this.startZ+0.075, 
		        width: 0.5, height: 0.35, rotationX: -90,
		        red:102, green:188, blue:242
		    });

		    // bottom 
		    var bottom = new Plane({
		        x: this.startX, y: this.startY-0.25, z: this.startZ+0.075, 
		        width: 0.5, height: 0.35, rotationX: 90,
		        red:102, green:188, blue:242
		    });

		    // mouth 
		    var mouth_front = new Plane({
		        x: this.startX, y: this.startY+0.03, z: this.startZ+0.3, 
		        width: 0.09, height: 0.06,
		        asset: "shiny_poliwag_mouth"
		    });

		    var mouth_top = new Plane({
		        x: this.startX, y: this.startY+0.06, z: this.startZ+0.275, 
		        width: 0.09, height: 0.05, rotationX: -90,
		        red: 254, green: 179, blue: 205
		    });

		    var mouth_bottom = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ+0.275, 
		        width: 0.09, height: 0.05, rotationX: 90,
		        red: 254, green: 179, blue: 205
		    });

		    var mouth_left = new Plane({
		        x: this.startX-0.045, y: this.startY+0.03, z: this.startZ+0.275, 
		        width: 0.05, height: 0.06, rotationY: -90,
		        red: 254, green: 179, blue: 205
		    });

		    var mouth_right = new Plane({
		        x: this.startX+0.045, y: this.startY+0.03, z: this.startZ+0.275, 
		        width: 0.05, height: 0.06, rotationY: 90,
		        red: 254, green: 179, blue: 205
		    });

		    // legs
		    var leg_left = new Box ({
		        x: this.startX-0.12, y: this.startY-0.275, z: this.startZ+0.17,
		        width: 0.1, height:0.05, depth:0.3,
		        red:102, green:188, blue:242
		    });

		    var leg_right = new Box ({
		        x: this.startX+0.12, y: this.startY-0.275, z: this.startZ+0.17,
		        width: 0.1, height:0.05, depth:0.3,
		        rotationX: -15,
		        red:102, green:188, blue:242
		    });

		    // tail
		    var tail_blue = new Box ({
		        x: this.startX, y: this.startY-0.1, z: this.startZ-0.1,
		        width: 0.05, height:0.05, depth:0.35,
		        red:102, green:188, blue:242
		    });

		    var tail_white = new Box ({
		        x: this.startX, y: this.startY-0.1, z: this.startZ-0.1,
		        width: 0.25, height:0.025, depth:0.65,
		        red:227, green:234, blue:244
		        //red:0, green:0, blue:0
		    });

		    this.sensor = new Box({
		      x: this.startX, y: this.startY, z: this.startZ + 0.25,
		      width: 0.1, height: 0.1, depth: 0.1,
		      red: 0, green: 255, blue: 0,
		      opacity: boxOpacity
		    });

		    this.shadow = new Plane
		    ({
		        x: this.startX, y: this.startY-0.295, z: this.startZ+0.12, 
		        width: 0.5, height: 0.45, rotationX: -90,
		        red: this.shadowRed, green: this.shadowGreen, blue: this.shadowBlue
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
		}

		else if (this.pokemonName == "diglett") {
			// face 
		    var face = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ+0.15, 
		        width: 0.3, height: 0.5,
		        asset: "shiny_diglett_face"
		    });

		    // back 
		    var back = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ-0.15, 
		        width: 0.3, height: 0.5, rotationY: 180,
		        red:220, green:181, blue:150
		    });

		    // side left
		    var left = new Plane({
		        x: this.startX-0.15, y: this.startY, z: this.startZ, 
		        width: 0.3, height: 0.5, rotationY: -90,
		        red:220, green:181, blue:150
		    });

		    // side right
		    var right = new Plane({
		        x: this.startX+0.15, y: this.startY, z: this.startZ, 
		        width: 0.3, height: 0.5, rotationY: 90,
		        red:220, green:181, blue:150
		    });

		    // head 
		    var head = new Plane({
		        x: this.startX, y: this.startY+0.25, z: this.startZ, 
		        width: 0.3, height: 0.3, rotationX: -90,
		        red:220, green:181, blue:150
		    });

		    // bottom 
		    var bottom = new Plane({
		        x: this.startX, y: this.startY-0.25, z: this.startZ, 
		        width: 0.3, height: 0.3, rotationX: 90,
		        red:220, green:181, blue:150
		    });

		    // nose 
		    var nose_front = new Plane({
		        x: this.startX, y: this.startY+0.025, z: this.startZ+0.2, 
		        width: 0.12, height: 0.07,
		        asset: "shiny_diglett_nose"
		    });

		    var nose_top = new Plane({
		        x: this.startX, y: this.startY+0.055, z: this.startZ+0.175, 
		        width: 0.12, height: 0.05, rotationX: -90,
		        red: 149, green: 183, blue: 224
		    });

		    var nose_bottom = new Plane({
		        x: this.startX, y: this.startY-0.005, z: this.startZ+0.175, 
		        width: 0.12, height: 0.05, rotationX: 90,
		        red: 149, green: 183, blue: 224
		    });

		    var nose_left = new Plane({
		        x: this.startX-0.06, y: this.startY+0.025, z: this.startZ+0.175, 
		        width: 0.05, height: 0.07, rotationY: -90,
		        red: 149, green: 183, blue: 224
		    });

		    var nose_right = new Plane({
		        x: this.startX+0.06, y: this.startY+0.025, z: this.startZ+0.175, 
		        width: 0.05, height: 0.07, rotationY: 90,
		        red: 149, green: 183, blue: 224
		    });

		    // ground 
		    var ground = new Box({
		    	x: this.startX, y: this.startY-0.3, z: this.startZ, 
		    	width: 0.5, height: 0.1, depth: 0.5,
		    	red:123, green:133, blue:125
		    });

		    // stones 
		    var stone1 = new Box({
		    	x: this.startX-0.15, y: this.startY-0.235, z: this.startZ+0.175, 
		    	width: 0.06, height: 0.03, depth: 0.05,
		    	red:183, green:204, blue:195
		    });

		    var stone2 = new Box({
		    	x: this.startX-0.19, y: this.startY-0.24, z: this.startZ, 
		    	width: 0.03, height: 0.02, depth: 0.03,
		    	red:183, green:204, blue:195
		    });

		    var stone3 = new Box({
		    	x: this.startX+0.2, y: this.startY-0.23, z: this.startZ+0.06, 
		    	width: 0.06, height: 0.04, depth: 0.06,
		    	red:183, green:204, blue:195
		    });

		    this.sensor = new Box({
		      x: this.startX , y: this.startY, z: this.startZ + 0.2,
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
		}

		else if (this.pokemonName == "bulbasaur") {
			// face 
		    var face_front = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ+0.1, 
		        width: 0.5, height: 0.3,
		        asset: "shiny_bulbasaur_face"
		    });

		    var face_back = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ-0.1, 
		        width: 0.5, height: 0.3, rotationY: 180,
		        red: 187, green: 229, blue: 113
		    });

		    var face_left = new Plane({
		        x: this.startX-0.25, y: this.startY, z: this.startZ, 
		        width: 0.2, height: 0.3, rotationY: -90,
		        red: 187, green: 229, blue: 113
		    });

		    var face_right = new Plane({
		        x: this.startX+0.25, y: this.startY, z: this.startZ, 
		        width: 0.2, height: 0.3, rotationY: 90,
		        red: 187, green: 229, blue: 113
		    });

		    var face_top = new Plane({
		        x: this.startX, y: this.startY+0.15, z: this.startZ, 
		        width: 0.5, height: 0.2, rotationX: -90,
		        asset: "shiny_bulbasaur_face_top"
		    });

		    var face_bottom = new Plane({
		        x: this.startX, y: this.startY-0.15, z: this.startZ, 
		        width: 0.5, height: 0.2, rotationX: 90,
		        red: 187, green: 229, blue: 113
		    });

		    var ear_left = new Box({
		        x: this.startX-0.19, y: this.startY+0.15+0.025, z: this.startZ, 
		        width: 0.12, height: 0.05, depth: 0.08,
		        red: 187, green: 229, blue: 113
		    });

		    var ear_right = new Box({
		        x: this.startX+0.19, y: this.startY+0.15+0.025, z: this.startZ, 
		        width: 0.12, height: 0.05, depth: 0.08,
		        red: 187, green: 229, blue: 113
		    });

		    // legs
		    var leg_front_left = new Box({
		        x: this.startX-0.15, y: this.startY-0.2, z: this.startZ-0.05, 
		        width: 0.1, height: 0.1, depth: 0.1,
		        red: 187, green: 229, blue: 113
		    });

		    var leg_front_right = new Box({
		        x: this.startX+0.15, y: this.startY-0.2, z: this.startZ-0.05, 
		        width: 0.1, height: 0.1, depth: 0.1,
		        red: 187, green: 229, blue: 113
		    });

		    var leg_back_left = new Box({
		        x: this.startX-0.15, y: this.startY-0.2, z: this.startZ-0.45, 
		        width: 0.1, height: 0.1, depth: 0.1,
		        red: 187, green: 229, blue: 113
		    });

		    var leg_back_right = new Box({
		        x: this.startX+0.15, y: this.startY-0.2, z: this.startZ-0.45, 
		        width: 0.1, height: 0.1, depth: 0.1,
		        red: 187, green: 229, blue: 113
		    });

		    // body
		    var body = new Box({
		        x: this.startX, y: this.startY-0.05, z: this.startZ-0.3, 
		        width: 0.4, height: 0.25, depth: 0.4,
		        asset: "shiny_bulbasaur_body"
		    });

		    // seed
		    var seed_front = new Plane({
		        x: this.startX, y: this.startY+0.185, z: this.startZ-0.1, 
		        width: 0.5, height: 0.22,
		        asset: "shiny_bulbasaur_seed_side"
		    });

		    var seed_back = new Plane({
		        x: this.startX, y: this.startY+0.185, z: this.startZ-0.55, 
		        width: 0.5, height: 0.22, rotationY: 180,
		        asset: "shiny_bulbasaur_seed_side"
		    });

		    var seed_left = new Plane({
		        x: this.startX-0.25, y: this.startY+0.185, z: this.startZ-0.325, 
		        width: 0.45, height: 0.22, rotationY: -90,
		        asset: "shiny_bulbasaur_seed_side2"
		    });

		    var seed_right = new Plane({
		        x: this.startX+0.25, y: this.startY+0.185, z: this.startZ-0.325, 
		        width: 0.45, height: 0.22, rotationY: 90,
		        asset: "shiny_bulbasaur_seed_side2"
		    });

		    var seed_top = new Plane({
		        x: this.startX, y: this.startY+0.295, z: this.startZ-0.325, 
		        width: 0.5, height: 0.45, rotationX: -90,
		        asset: "shiny_bulbasaur_seed_top"
		    });

		    var seed_bottom = new Plane({
		        x: this.startX, y: this.startY+0.075, z: this.startZ-0.325, 
		        width: 0.5, height: 0.45, rotationX: 90,
		        red: 96, green: 206, blue: 75
		    });

		    var seedtop_front = new Plane({
		        x: this.startX, y: this.startY+0.335, z: this.startZ-0.225, 
		        width: 0.2, height: 0.08,
		        asset: "shiny_bulbasaur_seedtop_side"
		    });

		    var seedtop_back = new Plane({
		        x: this.startX, y: this.startY+0.335, z: this.startZ-0.425, 
		        width: 0.2, height: 0.08, rotationY: 180,
		        asset: "shiny_bulbasaur_seedtop_side"
		    });

		    var seedtop_left = new Plane({
		        x: this.startX-0.1, y: this.startY+0.335, z: this.startZ-0.325, 
		        width: 0.2, height: 0.08, rotationY: -90,
		        asset: "shiny_bulbasaur_seedtop_side"
		    });

		    var seedtop_right = new Plane({
		        x: this.startX+0.1, y: this.startY+0.335, z: this.startZ-0.325, 
		        width: 0.2, height: 0.08, rotationY: 90,
		        asset: "shiny_bulbasaur_seedtop_side"
		    });

		    var seedtop_top = new Plane({
		        x: this.startX, y: this.startY+0.375, z: this.startZ-0.325, 
		        width: 0.2, height: 0.2, rotationX: -90,
		        asset: "shiny_bulbasaur_seedtop_top"
		    });

		    this.sensor = new Box({
		      x: this.startX , y: this.startY, z: this.startZ + 0.6,
		      width: 0.1, height: 0.1, depth: 0.1,
		      red: 0, green: 255, blue: 0,
		      opacity: boxOpacity
		    });

		    this.shadow = new Plane
		    ({
		        x: this.startX, y: this.startY-0.245, z: this.startZ-0.2, 
		        width: 0.5, height: 0.65, rotationX: -90,
		        red: this.shadowRed, green: this.shadowGreen, blue: this.shadowBlue
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
		}

		else if (this.pokemonName == "magnemite") {
			// face 
		    var face = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ+0.15, 
		        width: 0.3, height: 0.3,
		        asset: "shiny_magnemite_face"
		    });

		    // back 
		    var back = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ-0.15, 
		        width: 0.3, height: 0.3, rotationY: 180,
		        red: 199, green: 190, blue: 159
		    });

		    // side left
		    var left = new Plane({
		        x: this.startX-0.15, y: this.startY, z: this.startZ, 
		        width: 0.3, height: 0.3, rotationY: -90,
		        red: 199, green: 190, blue: 159
		    });

		    // side right
		    var right = new Plane({
		        x: this.startX+0.15, y: this.startY, z: this.startZ, 
		        width: 0.3, height: 0.3, rotationY: 90,
		        red: 199, green: 190, blue: 159
		    });

		    // head 
		    var head = new Plane({
		        x: this.startX, y: this.startY+0.15, z: this.startZ, 
		        width: 0.3, height: 0.3, rotationX: -90,
		        red: 199, green: 190, blue: 159
		    });

		    // bottom 
		    var bottom = new Plane({
		        x: this.startX, y: this.startY-0.15, z: this.startZ, 
		        width: 0.3, height: 0.3, rotationX: 90,
		        red: 199, green: 190, blue: 159
		    });

		    // screw box
		    var screwbox_left = new Box({
		        x: this.startX-0.1, y: this.startY-0.1, z: this.startZ+0.16, 
		        width: 0.02, height: 0.02, depth: 0.02,
		        red: 195, green: 204, blue: 203
		    });

		    var screwbox_right = new Box({
		        x: this.startX+0.1, y: this.startY-0.1, z: this.startZ+0.16, 
		        width: 0.02, height: 0.02, depth: 0.02,
		        red: 195, green: 204, blue: 203
		    });

		    var screwbox_top = new Box({
		        x: this.startX, y: this.startY+0.175, z: this.startZ, 
		        width: 0.04, height: 0.05, depth: 0.04,
		        asset: "shiny_magnemite_face_screwtop_box"
		    });

		    // face screws
		    var face_screw_left_front = new Plane({
		        x: this.startX-0.1, y: this.startY-0.1, z: this.startZ+0.19, 
		        width: 0.06, height: 0.06, 
		        asset: "shiny_magnemite_face_screw"
		    });

		    var face_screw_right_front = new Plane({
		        x: this.startX+0.1, y: this.startY-0.1, z: this.startZ+0.19, 
		        width: 0.06, height: 0.06, 
		        asset: "shiny_magnemite_face_screw"
		    });

		    var face_screw_left_back = new Plane({
		        x: this.startX-0.1, y: this.startY-0.1, z: this.startZ+0.17, 
		        width: 0.06, height: 0.06, rotationY: 180,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_right_back = new Plane({
		        x: this.startX+0.1, y: this.startY-0.1, z: this.startZ+0.17, 
		        width: 0.06, height: 0.06, rotationY: 180,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_left_left = new Plane({
		        x: this.startX-0.13, y: this.startY-0.1, z: this.startZ+0.18, 
		        width: 0.02, height: 0.06, rotationY: -90,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_right_left = new Plane({
		        x: this.startX+0.07, y: this.startY-0.1, z: this.startZ+0.18, 
		        width: 0.02, height: 0.06, rotationY: -90,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_left_right = new Plane({
		        x: this.startX-0.07, y: this.startY-0.1, z: this.startZ+0.18, 
		        width: 0.02, height: 0.06, rotationY: 90,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_right_right = new Plane({
		        x: this.startX+0.13, y: this.startY-0.1, z: this.startZ+0.18, 
		        width: 0.02, height: 0.06, rotationY: 90,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_left_top = new Plane({
		        x: this.startX-0.1, y: this.startY-0.07, z: this.startZ+0.18, 
		        width: 0.06, height: 0.02, rotationX: -90,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_right_top = new Plane({
		        x: this.startX+0.1, y: this.startY-0.07, z: this.startZ+0.18, 
		        width: 0.06, height: 0.02, rotationX: -90,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_left_bottom = new Plane({
		        x: this.startX-0.1, y: this.startY-0.13, z: this.startZ+0.18, 
		        width: 0.06, height: 0.02, rotationX: 90,
		        red: 195, green: 204, blue: 203 
		    });

		    var face_screw_right_bottom = new Plane({
		        x: this.startX+0.1, y: this.startY-0.13, z: this.startZ+0.18, 
		        width: 0.06, height: 0.02, rotationX: 90,
		        red: 195, green: 204, blue: 203 
		    });

		    var head_screw_top = new Plane({
		        x: this.startX, y: this.startY+0.25, z: this.startZ, 
		        width: 0.15, height: 0.15, rotationX: -90,
		        asset: "shiny_magnemite_top_screw"
		    });

		    var head_screw_bottom = new Plane({
		        x: this.startX, y: this.startY+0.2, z: this.startZ, 
		        width: 0.15, height: 0.15, rotationX: 90,
		        red: 195, green: 204, blue: 203 
		    });

		    var head_screw_front = new Plane({
		        x: this.startX, y: this.startY+0.225, z: this.startZ+0.075, 
		        width: 0.15, height: 0.05,
		        red: 195, green: 204, blue: 203 
		    });

		    var head_screw_back = new Plane({
		        x: this.startX, y: this.startY+0.225, z: this.startZ-0.075, 
		        width: 0.15, height: 0.05, rotationY: 180,
		        red: 195, green: 204, blue: 203 
		    });

		    var head_screw_left = new Plane({
		        x: this.startX-0.075, y: this.startY+0.225, z: this.startZ, 
		        width: 0.15, height: 0.05, rotationY: -90,
		        red: 195, green: 204, blue: 203 
		    });

		    var head_screw_right = new Plane({
		        x: this.startX+0.075, y: this.startY+0.225, z: this.startZ, 
		        width: 0.15, height: 0.05, rotationY: 90,
		        red: 195, green: 204, blue: 203 
		    });

		    // magnets
		    var magnet_left_bottom = new Box({
		        x: this.startX-0.185, y: this.startY, z: this.startZ, 
		        width: 0.07, height: 0.23, depth: 0.07,
		        red: 136, green: 139, blue: 134 
		    });

		    var magnet_right_bottom = new Box({
		        x: this.startX+0.185, y: this.startY, z: this.startZ, 
		        width: 0.07, height: 0.23, depth: 0.07,
		        red: 136, green: 139, blue: 134 
		    });

		    var magnet_left_upper = new Box({
		        x: this.startX-0.27, y: this.startY+0.08, z: this.startZ, 
		        width: 0.11, height: 0.07, depth: 0.07,
		        red: 136, green: 139, blue: 134 
		    });

		    var magnet_left_lower = new Box({
		        x: this.startX-0.27, y: this.startY-0.08, z: this.startZ, 
		        width: 0.11, height: 0.07, depth: 0.07,
		        red: 136, green: 139, blue: 134 
		    });

		    var magnet_right_upper = new Box({
		        x: this.startX+0.27, y: this.startY+0.08, z: this.startZ, 
		        width: 0.11, height: 0.07, depth: 0.07,
		        red: 136, green: 139, blue: 134 
		    });

		    var magnet_right_lower = new Box({
		        x: this.startX+0.27, y: this.startY-0.08, z: this.startZ, 
		        width: 0.1, height: 0.07, depth: 0.07,
		        red: 136, green: 139, blue: 134 
		    });

		    var magnet_blue_left = new Box({
		        x: this.startX-0.355, y: this.startY-0.08, z: this.startZ, 
		        width: 0.07, height: 0.07, depth: 0.07,
		        red: 115, green: 115, blue: 114 
		    });

		    var magnet_blue_right = new Box({
		        x: this.startX+0.355, y: this.startY+0.08, z: this.startZ, 
		        width: 0.07, height: 0.07, depth: 0.07,
		        red: 115, green: 115, blue: 114 
		    });

		     var magnet_red_left = new Box({
		        x: this.startX-0.355, y: this.startY+0.08, z: this.startZ, 
		        width: 0.07, height: 0.07, depth: 0.07,
		        red: 115, green: 115, blue: 114 
		    });

		    var magnet_red_right = new Box({
		        x: this.startX+0.355, y: this.startY-0.08, z: this.startZ, 
		        width: 0.07, height: 0.07, depth: 0.07,
		        red: 115, green: 115, blue: 114 
		    });

		    this.sensor = new Box({
		      x: this.startX , y: this.startY, z: this.startZ + 0.65,
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
		}

		else if (this.pokemonName == "pikachu") {
			// face 
		    var face = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ+0.08, 
		        width: 0.5, height: 0.35,
		        asset: "shiny_pikachu_face"
		    });

		    var back = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ-0.52, 
		        width: 0.5, height: 0.35, rotationY: 180,
		        red: 252, green: 199, blue: 67
		    });

		    var left = new Plane({
		        x: this.startX-0.25, y: this.startY, z: this.startZ-0.22, 
		        width: 0.6, height: 0.35, rotationY: -90,
		        asset: "shiny_pikachu_left"
		    });

		    var right = new Plane({
		        x: this.startX+0.25, y: this.startY, z: this.startZ-0.22, 
		        width: 0.6, height: 0.35, rotationY: 90,
		        asset: "shiny_pikachu_right"
		    });

		    var top = new Plane({
		        x: this.startX, y: this.startY+0.175, z: this.startZ-0.22, 
		        width: 0.5, height: 0.6, rotationX: -90,
		        asset: "shiny_pikachu_top"
		    });

		    var bottom = new Plane({
		        x: this.startX, y: this.startY-0.175, z: this.startZ-0.22, 
		        width: 0.5, height: 0.6, rotationX: 90,
		        red: 252, green: 199, blue: 67
		    });

		    // legs
		    var leg_front_left = new Box({
		        x: this.startX-0.13, y: this.startY-0.235, z: this.startZ-0.07, 
		        width: 0.12, height: 0.12, depth: 0.12,
		        red: 252, green: 199, blue: 67
		    });

		    var leg_front_right = new Box({
		        x: this.startX+0.13, y: this.startY-0.235, z: this.startZ-0.07, 
		        width: 0.12, height: 0.12, depth: 0.12,
		        red: 252, green: 199, blue: 67
		    });

		    var leg_back_left = new Box({
		        x: this.startX-0.13, y: this.startY-0.235, z: this.startZ-0.46, 
		        width: 0.12, height: 0.12, depth: 0.12,
		        red: 252, green: 199, blue: 67
		    });

		    var leg_back_right = new Box({
		        x: this.startX+0.13, y: this.startY-0.235, z: this.startZ-0.46, 
		        width: 0.12, height: 0.12, depth: 0.12,
		        red: 252, green: 199, blue: 67
		    });

		    // ears 
		    var ear_left = new Box({
		        x: this.startX-0.12, y: this.startY+0.26, z: this.startZ, 
		        width: 0.13, height: 0.23, depth: 0.06,
		        //rotationX: -10,
		        red: 252, green: 199, blue: 67
		    });

		    var ear_right = new Box({
		        x: this.startX+0.12, y: this.startY+0.26, z: this.startZ, 
		        width: 0.13, height: 0.23, depth: 0.06,
		        //rotationX: -10,
		        red: 252, green: 199, blue: 67
		    });

		    var ear_left_top = new Box({
		        x: this.startX-0.12, y: this.startY+0.425, z: this.startZ, 
		        width: 0.13, height: 0.1, depth: 0.06,
		        //rotationX: -10,
		        red: 31, green: 21, blue: 22
		    });

		    var ear_right_top = new Box({
		        x: this.startX+0.12, y: this.startY+0.425, z: this.startZ, 
		        width: 0.13, height: 0.1, depth: 0.06,
		        //rotationX: -10,
		        red: 31, green: 21, blue: 22
		    });

		    // tail
		    var tail_bottom = new Box({
		        x: this.startX, y: this.startY+0.19, z: this.startZ-0.53, 
		        width: 0.08, height: 0.22, depth: 0.02,
		        rotationZ: -50,
		        red: 193, green: 90, blue: 38
		    });

		    var tail_middle = new Box({
		        x: this.startX, y: this.startY+0.32, z: this.startZ-0.53, 
		        width: 0.12, height: 0.28, depth: 0.02,
		        rotationZ: -50,
		        red: 252, green: 199, blue: 67
		    });

		    var tail_top = new Box({
		        x: this.startX+0.04, y: this.startY+0.49, z: this.startZ-0.53, 
		        width: 0.2, height: 0.32, depth: 0.02,
		        rotationZ: -50,
		        red: 252, green: 199, blue: 67
		    });

		    this.sensor = new Box({
		      x: this.startX , y: this.startY, z: this.startZ + 0.58,
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
		}

		else if (this.pokemonName == "slowpoke") {
			// face 
		    var face_front = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ+0.075, 
		        width: 0.3, height: 0.3,
		        asset: "shiny_slowpoke_face"
		    });

		    var face_back = new Plane({
		        x: this.startX, y: this.startY, z: this.startZ-0.075, 
		        width: 0.3, height: 0.3, rotationY: 180,
		        red: 222, green: 196, blue: 208
		    });

		    var face_left = new Plane({
		        x: this.startX-0.15, y: this.startY, z: this.startZ, 
		        width: 0.15, height: 0.3, rotationY: -90,
		        red: 222, green: 196, blue: 208
		    });

		    var face_right = new Plane({
		        x: this.startX+0.15, y: this.startY, z: this.startZ, 
		        width: 0.15, height: 0.3, rotationY: 90,
		        red: 222, green: 196, blue: 208
		    });

		    var face_top = new Plane({
		        x: this.startX, y: this.startY+0.15, z: this.startZ, 
		        width: 0.3, height: 0.15, rotationX: -90,
		        red: 222, green: 196, blue: 208
		    });

		    var face_bottom = new Plane({
		        x: this.startX, y: this.startY-0.15, z: this.startZ, 
		        width: 0.3, height: 0.15, rotationX: 90,
		        red: 222, green: 196, blue: 208
		    });

		    var body = new Box({
		        x: this.startX, y: this.startY+0.01, z: this.startZ-0.3, 
		        width: 0.4, height: 0.32, depth: 0.45,
		        red: 222, green: 196, blue: 208
		    });

		    var leg_front_left = new Box({
		        x: this.startX-0.25, y: this.startY-0.1, z: this.startZ-0.075, 
		        width: 0.1, height: 0.1, depth: 0.16,
		        red: 222, green: 196, blue: 208
		    });

		    var leg_front_right = new Box({
		        x: this.startX+0.25, y: this.startY-0.1, z: this.startZ-0.075, 
		        width: 0.1, height: 0.1, depth: 0.16,
		        rotationX: -30,
		        red: 222, green: 196, blue: 208
		    });

		    var leg_back_left = new Box({
		        x: this.startX-0.275, y: this.startY-0.075, z: this.startZ-0.415, 
		        width: 0.15, height: 0.15, depth: 0.22,
		        rotationX: -30,
		        red: 222, green: 196, blue: 208
		    });

		    var leg_back_right = new Box({
		        x: this.startX+0.275, y: this.startY-0.075, z: this.startZ-0.415, 
		        width: 0.15, height: 0.15, depth: 0.22,
		        red: 222, green: 196, blue: 208
		    });

		    // mouth
		    var mouth_top_front = new Plane({
		        x: this.startX, y: this.startY-0.05625, z: this.startZ+0.125, 
		        width: 0.2, height: 0.0625,
		        asset: "shiny_slowpoke_mouth_top"
		    });

		    var mouth_top_back = new Plane({
		        x: this.startX, y: this.startY-0.05625, z: this.startZ+0.075, 
		        width: 0.2, height: 0.0625,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_top_left = new Plane({
		        x: this.startX-0.1, y: this.startY-0.05625, z: this.startZ+0.1, 
		        width: 0.05, height: 0.0625, rotationY: -90,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_top_right = new Plane({
		        x: this.startX+0.1, y: this.startY-0.05625, z: this.startZ+0.1, 
		        width: 0.05, height: 0.0625, rotationY: 90,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_top_top = new Plane({
		        x: this.startX, y: this.startY-0.025, z: this.startZ+0.1, 
		        width: 0.2, height: 0.05, rotationX: -90,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_top_bottom = new Plane({
		        x: this.startX, y: this.startY-0.0875, z: this.startZ+0.1, 
		        width: 0.2, height: 0.05, rotationX: 90,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_bottom_front = new Plane({
		        x: this.startX, y: this.startY-0.11875, z: this.startZ+0.1, 
		        width: 0.2, height: 0.0625,
		        asset: "shiny_slowpoke_mouth_bottom"
		    });

		    var mouth_bottom_back = new Plane({
		        x: this.startX, y: this.startY-0.11875, z: this.startZ+0.075, 
		        width: 0.2, height: 0.0625,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_bottom_left = new Plane({
		        x: this.startX-0.1, y: this.startY-0.11875, z: this.startZ+0.0875, 
		        width: 0.025, height: 0.0625, rotationY: -90,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_bottom_right = new Plane({
		        x: this.startX+0.1, y: this.startY-0.11875, z: this.startZ+0.0875, 
		        width: 0.025, height: 0.0625, rotationY: 90,
		        red: 217, green: 207, blue: 168
		    });

		    var mouth_bottom_bottom = new Plane({
		        x: this.startX, y: this.startY-0.15, z: this.startZ+0.0875, 
		        width: 0.2, height: 0.025, rotationX: 90,
		        red: 217, green: 207, blue: 168
		    });

		    var tooth_left = new Box({
		        x: this.startX-0.065, y: this.startY-0.1+0.005, z: this.startZ+0.11, 
		        width: 0.015, height: 0.015, depth: 0.015,
		        red: 232, green: 232, blue: 235
		    });

		    var tooth_right = new Box({
		        x: this.startX+0.065, y: this.startY-0.1+0.005, z: this.startZ+0.11, 
		        width: 0.015, height: 0.015, depth: 0.015,
		        red: 232, green: 232, blue: 235
		    });

		    // ears 
		    var ear_left_front = new Plane({
		        x: this.startX-0.15, y: this.startY+0.16, z: this.startZ+0.05, 
		        width: 0.12, height: 0.12,
		        asset: "shiny_slowpoke_ear_left"
		    });

		    var ear_right_front = new Plane({
		        x: this.startX+0.15, y: this.startY+0.16, z: this.startZ+0.05, 
		        width: 0.12, height: 0.12,
		        asset: "shiny_slowpoke_ear_right"
		    });

		    var ear_left_back = new Plane({
		        x: this.startX-0.15, y: this.startY+0.16, z: this.startZ+0.01, 
		        width: 0.12, height: 0.12, rotationY: 180,
		        red: 222, green: 196, blue: 208
		    });

		    var ear_right_back = new Plane({
		        x: this.startX+0.15, y: this.startY+0.16, z: this.startZ+0.01, 
		        width: 0.12, height: 0.12, rotationY: 180,
		        red: 222, green: 196, blue: 208
		    });

		    var ear_left_left = new Plane({
		        x: this.startX-0.21, y: this.startY+0.16, z: this.startZ+0.02, 
		        width: 0.06, height: 0.12, rotationY: -90,
		        red: 222, green: 196, blue: 208
		    });

		    var ear_left_right = new Plane({
		        x: this.startX-0.09, y: this.startY+0.16, z: this.startZ+0.02, 
		        width: 0.06, height: 0.12, rotationY: 90,
		        red: 222, green: 196, blue: 208
		    });

		    var ear_right_left = new Plane({
		        x: this.startX+0.09, y: this.startY+0.16, z: this.startZ+0.02, 
		        width: 0.06, height: 0.12, rotationY: -90,
		        red: 222, green: 196, blue: 208
		    });

		    var ear_right_right = new Plane({
		        x: this.startX+0.21, y: this.startY+0.16, z: this.startZ+0.02, 
		        width: 0.06, height: 0.12, rotationY: 90,
		        red: 222, green: 196, blue: 208
		    });

		    var ear_left_top = new Plane({
		        x: this.startX-0.15, y: this.startY+0.22, z: this.startZ+0.02, 
		        width: 0.12, height: 0.06, rotationX: -90,
		        red: 222, green: 196, blue: 208
		    });

		    var ear_right_top = new Plane({
		        x: this.startX+0.15, y: this.startY+0.22, z: this.startZ+0.02, 
		        width: 0.12, height: 0.06, rotationX: -90,
		        red: 222, green: 196, blue: 208
		    });

		    var ear_left_bottom = new Plane({
		        x: this.startX-0.15, y: this.startY+0.1, z: this.startZ+0.02, 
		        width: 0.12, height: 0.06, rotationX: 90,
		        red: 222, green: 196, blue: 208
		    });

		    var ear_right_bottom = new Plane({
		        x: this.startX+0.15, y: this.startY+0.1, z: this.startZ+0.02, 
		        width: 0.12, height: 0.06, rotationX: 90,
		        red: 222, green: 196, blue: 208
		    });

		    var tail_bottom = new Box({
		        x: this.startX, y: this.startY+0.14, z: this.startZ-0.6, 
		        width: 0.12, height: 0.58, depth: 0.15,
		        red: 222, green: 196, blue: 208
		    });

		    var tail_middle = new Box({
		        x: this.startX, y: this.startY+0.01+0.25+0.11, z: this.startZ-0.525, 
		        width: 0.12, height: 0.12, depth: 0.2,
		        red: 222, green: 196, blue: 208
		    });

		    var tail_end = new Box({
		        x: this.startX, y: this.startY+0.01+0.25+0.11, z: this.startZ-0.365, 
		        width: 0.12, height: 0.12, depth: 0.12,
		        red: 253, green: 243, blue: 252
		    });

		    this.sensor = new Box({
		      x: this.startX , y: this.startY, z: this.startZ + 0.575,
		      width: 0.1, height: 0.1, depth: 0.1,
		      red: 0, green: 255, blue: 0,
		      opacity: boxOpacity
		    });

		    // add the different components of the Pokemon
			// slowpoke's face
		    this.container.addChild(face_front);
		    this.container.addChild(face_back);
		    this.container.addChild(face_left);
		    this.container.addChild(face_right);
		    this.container.addChild(face_top);
		    this.container.addChild(face_bottom);

		    // slowpoke's body
		    this.container.addChild(body);

		    // slowpoke's legs
		    this.container.addChild(leg_front_left);
		    this.container.addChild(leg_front_right);
		    this.container.addChild(leg_back_left);
		    this.container.addChild(leg_back_right);

		    // slowpoke's mouth
		    this.container.addChild(mouth_top_front);
		    this.container.addChild(mouth_top_back);
		    this.container.addChild(mouth_top_left);
		    this.container.addChild(mouth_top_right);
		    this.container.addChild(mouth_top_top);
		    this.container.addChild(mouth_top_bottom);
		    this.container.addChild(mouth_bottom_front);
		    this.container.addChild(mouth_bottom_back);
		    this.container.addChild(mouth_bottom_left);
		    this.container.addChild(mouth_bottom_right);
		    this.container.addChild(mouth_bottom_bottom);
		    this.container.addChild(tooth_left);
		    this.container.addChild(tooth_right);

		    // slowpoke's ears
		    this.container.addChild(ear_left_front);
		    this.container.addChild(ear_right_front);
		    this.container.addChild(ear_left_back);
		    this.container.addChild(ear_right_back);
		    this.container.addChild(ear_left_left);
		    this.container.addChild(ear_left_right);
		    this.container.addChild(ear_right_left);
		    this.container.addChild(ear_right_right);
		    this.container.addChild(ear_left_top);
		    this.container.addChild(ear_right_top);
		    this.container.addChild(ear_left_bottom);
		    this.container.addChild(ear_right_bottom);

		    // slowpoke's tail
		    this.container.addChild(tail_bottom);
		    this.container.addChild(tail_middle);
		    this.container.addChild(tail_end);
		}
	}
}