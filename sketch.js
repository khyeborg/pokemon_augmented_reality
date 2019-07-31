// world variable
var world; 

// pokemon variables
var poliwagShadow = [83, 131, 197], diglettShadow = [0, 0, 0], bulbasaurShadow = [116, 178, 108], magnemiteShadow = [0, 0, 0], pikachuShadow = [0, 0, 0], slowpokeShadow = [0, 0, 0];
var pokemons = []; 

// marker variables
var pikachuMarker, bulbasaurMarker, poliwagMarker, magnemiteMarker, diglettMarker, slowpokeMarker, zbMarker;
var pokemonMarkers = [], pokemonNames = ["poliwag", "diglett", "bulbasaur", "magnemite","pikachu", "slowpoke"];
var poliwag, diglett, bulbasaur, magnemite, pikachu, slowpoke;
var pokeballArray = [];
// var setCoolDown = 10;
// var setCoolDown = 60;
var setCoolDown = 100;
var cooldownArray = [setCoolDown, setCoolDown, setCoolDown, setCoolDown, setCoolDown, setCoolDown];
var markerWaitTime = 15;
var markerWaitTimeArray = [markerWaitTime, markerWaitTime, markerWaitTime, markerWaitTime, markerWaitTime, markerWaitTime];

// 3D model variables
var egg, eggScale = 0.005;
var pokeball, pokeballScale = 0.05;

// random setup variables
var temp;
var boxOpacity = 0; drawShadow = false;

// game variables
var turnAmount = 0.8;
var maximumGrowth = 2, growthRate = 0.01;
var startRotation = 360;
var scaleFactor = 0.75, geometricScaleFactor = 1;
var xConstrain = 3.5 * geometricScaleFactor, zConstrain = 3.5 * geometricScaleFactor; // screen is about 5 x-axis wide 
var shinyChanceNum = 10;

// lay babies variables
// var layBabiesTimeLower = 200, layBabiesTimeUpper = 300;
var layBabiesTimeLower = 1500, layBabiesTimeUpper = 3000;
var layBabiesTimeLowerShiny = 2000, layBabiesTimeUpperShiny = 6000;
var pregnantTime = 350;

function setup() {
    frameRate(50);
    
    // construct the A-Frame world
    world = new World('ARScene');

    var floor = new Plane({
        x: 0, y: 0, width: 8 * geometricScaleFactor, height: 8 * geometricScaleFactor, opacity: 0.25, rotationX: -90, // how to rotate the floor to make it work the way we want it to?
        asset: "floor_color",
        side: "double"
    });

    var floorCube = new Plane({
        x: 0, y: 0, width: 100, height: 0.1, depth: 100, rotationX: -90, 
        asset: "floor_color"
    });

    // grab a reference to our marker in the HTML document
    poliwagMarker   = world.getMarker("poliwagMarker");
    diglettMarker   = world.getMarker("diglettMarker");
    bulbasaurMarker = world.getMarker("bulbasaurMarker");
    magnemiteMarker = world.getMarker("magnemiteMarker");
    pikachuMarker   = world.getMarker("pikachuMarker");
    slowpokeMarker  = world.getMarker("slowpokeMarker");
    zbMarker        = world.getMarker("zbMarker");
    pokemonMarkers.push(poliwagMarker); pokemonMarkers.push(diglettMarker); pokemonMarkers.push(bulbasaurMarker); pokemonMarkers.push(magnemiteMarker); pokemonMarkers.push(pikachuMarker); pokemonMarkers.push(slowpokeMarker);

    // instantiate object and add to marker
    poliwag   = new MarkerPokemon("poliwag",   0, 0, 0, -90);      
    diglett   = new MarkerPokemon("diglett",   0, 0, 0, -90);   
    bulbasaur = new MarkerPokemon("bulbasaur", 0, 0, 0, -90); 
    magnemite = new MarkerPokemon("magnemite", 0, 0, 0, -90);  
    pikachu   = new MarkerPokemon("pikachu",   0, 0, 0, -90); 
    slowpoke  = new MarkerPokemon("slowpoke",   0, 0, 0, -90);  

    poliwagPokeball   = new Pokeball(); pokeballArray.push(poliwagPokeball);     
    diglettPokeball   = new Pokeball(); pokeballArray.push(diglettPokeball);   
    bulbasaurPokeball = new Pokeball(); pokeballArray.push(bulbasaurPokeball); 
    magnemitePokeball = new Pokeball(); pokeballArray.push(magnemitePokeball);  
    pikachuPokeball   = new Pokeball(); pokeballArray.push(pikachuPokeball);  
    slowpokePokeball  = new Pokeball(); pokeballArray.push(slowpokePokeball);    

    poliwagMarker.addChild(poliwagPokeball.container);
    diglettMarker.addChild(diglettPokeball.container);
    bulbasaurMarker.addChild(bulbasaurPokeball.container);
    magnemiteMarker.addChild(magnemitePokeball.container);
    pikachuMarker.addChild(pikachuPokeball.container);
    slowpokeMarker.addChild(slowpokePokeball.container);

    // create a static container that will always be visible to the user even if marker is not being detected
    staticContainer = new Container3D({
        x: 0, y: 0, z: 0 // should the x, y, and z coordinates be based on the floor tag then? 
    });
    staticContainer.addChild(floor);

    // add the static container to the world
    world.scene.appendChild(staticContainer.tag); // what is tag? 
}

function draw() {
    // mova and animate all Pokemons
    for (var i = 0; i < pokemons.length; i++) {
        pokemons[i].animate();

        // only start moving after Pokemon has fallen
        if (pokemons[i].fallen == true) { 
            pokemons[i].move();
            pokemons[i].layBabies();
        }
        else {
            pokemons[i].fall();
        }

        // pregant egg
        if (pokemons[i].pregnant == true) {pokemons[i].containerArray[pokemons[i].containerArray.length - 1].show();}
        else {pokemons[i].containerArray[pokemons[i].containerArray.length - 1].hide();}
        
        if (pokemons[i].fallen == true) {
            pokemons[i].growAmount = pokemons[i].grow();
            pokemons[i].container.setScale(pokemons[i].scale * pokemons[i].growAmount * scaleFactor, pokemons[i].scale * pokemons[i].growAmount * scaleFactor, pokemons[i].scale * pokemons[i].growAmount * scaleFactor);
        }
        else {
            pokemons[i].container.setScale(pokemons[i].scale * scaleFactor, pokemons[i].scale * scaleFactor, pokemons[i].scale * scaleFactor);
        }
    }

    // for loop to iterate through all markers
    for (var i = 0; i < pokemonMarkers.length; i++) {
        if (pokemonMarkers[i].isVisible()) {
            // have the marker be visible long enough
            if (markerWaitTimeArray[i] <= 0) {

                // which static container are we closest to? (I don't think we need these)
                var markerPosition = new THREE.Vector3().setFromMatrixPosition(pokemonMarkers[i].tag.object3D.matrixWorld);
                var s1Position = new THREE.Vector3().setFromMatrixPosition(staticContainer.tag.object3D.matrixWorld);

                // staticContainer
                if (cooldownArray[i] <= 0) {

                    // convert to local coordinates within staticContainer
                    var p = new THREE.Vector3();
                    p.setFromMatrixPosition(pokeballArray[i].container.tag.object3D.matrixWorld); // flying problem? 
                    p = staticContainer.tag.object3D.worldToLocal(p);

                    temp = new Pokemon(pokemonNames[i], pikachuShadow, p.x, p.y, p.z, Math.floor(random(1, 101)), false);
                    
                    // only add the Pokemon to the world if it was instantiated above the plane 
                    if (temp.container.getY() >= temp.markerPosY) {
                        staticContainer.addChild(temp.container);
                        pokemons.push(temp);
                    }

                    // indicate that we are in 'cooldown' mode
                    cooldownArray[i] = setCoolDown;
                }

                // process cooldown counter
                cooldownArray[i] -= 1;
                if (cooldownArray[i] < 0) {cooldownArray[i] = 0;}
            }
            markerWaitTimeArray[i] -= 1;
            if (markerWaitTimeArray[i] < 0) {markerWaitTimeArray[i] = 0;}
        }
        else {
            markerWaitTimeArray[i] = markerWaitTime;
        }
    }

    // the floor marker
    if (zbMarker.isVisible()) {
        // get the position of the marker
        var p = new THREE.Vector3();
        p.setFromMatrixPosition(zbMarker.tag.object3D.matrixWorld);

        // get the rotation of the marker
        var r = zbMarker.tag.object3D.rotation;

        // update our static container to have the same position & rotation as the marker
        staticContainer.setPosition(p.x, p.y, p.z);
        staticContainer.rotateX(degrees(r.x));
        staticContainer.rotateY(degrees(r.y));
        staticContainer.rotateZ(degrees(r.z));
    }
}