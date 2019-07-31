var world;

// references to our markers (which are defined in the HTML document)
var pikachuMarker, bulbasaurMarker, poliwagMarker, magnemiteMarker, diglettMarker, zbMarker;
var pokemonMarkers = [];
var pokemonNames = ["poliwag", "diglett", "bulbasaur", "magnemite","pikachu", "floor"];

// references to the objects
var pikachu, bulbasaur, poliwag, magnemite, diglett;

// cooldown indicator
var cooldown = 0;

var pokemons = [];
var boxOpacity = 0;
var scaleFactor = 0.1;
var xConstrain = 6 * scaleFactor, zConstrain = 10 * scaleFactor; // screen is about 5 x-axis wide 
var startRotation = 0;
var turnAmount = 0.8;
var shinyChanceNum = 50;
var poliwagShadow = [83, 131, 197], diglettShadow = [0, 0, 0], bulbasaurShadow = [116, 178, 108], magnemiteShadow = [0, 0, 0], pikachuShadow = [0, 0, 0], slowpokeShadow = [0, 0, 0];
var drawShadow = false;
//var numberOfPokemons = 12;

// 3D models
var egg, eggScale = 0.005;

// lay babies
// var layBabiesTimeLower = 200, layBabiesTimeUpper = 300;
var layBabiesTimeLower = 1000, layBabiesTimeUpper = 2000;
var pregnantTime = 500;

function setup() {
    frameRate(50);
    
    // construct the A-Frame world
    world = new World('ARScene');
    // world.setFlying(true);
    // world.setUserPosition(1.348390619747616, 0.6458707955548807, 6.508011021088525);
    // world.setUserPosition(0.5984239299672317, 2.3754209416864414, 8.413249113497988);
    // world.setUserPosition(0.2611772087318868, 9.198350431525817, 32.500726791711);

    var floor = new Plane({
        x: 0, y: 0, width: 100, height: 100, rotationX: -90, 
        //red: 0, green: 0, blue: 255,
        asset: "floor_color",
        side: "double"
    });
    // world.add(floor);

    // // instantiate Pokemon objects and add it to the pokemons array
    // pokemons.push(new Pokemon("diglett", diglettShadow, 0, 0.35, 3.7, Math.floor(random(1, 101))));
    // pokemons.push(new Pokemon("poliwag", poliwagShadow, 1, 0.3, 3.7, Math.floor(random(1, 101))));
    // pokemons.push(new Pokemon("bulbasaur", bulbasaurShadow, 2, 0.25, 4, Math.floor(random(1, 101))));
    // pokemons.push(new Pokemon("magnemite", magnemiteShadow, -1, 0.5, 3.7, Math.floor(random(1, 101))));
    // pokemons.push(new Pokemon("pikachu", pikachuShadow, 3, 0.295, 4, Math.floor(random(1, 101))));
    // pokemons.push(new Pokemon("slowpoke", slowpokeShadow, 4, 0.15, 4, Math.floor(random(1, 101))));


    // instantiating 50 Pokemon objects at random positions
    // for (var i = 0; i < 10; i++) {
    //     pokemons.push(new Pokemon("poliwag", poliwagShadow, random(-xConstrain, xConstrain), 0.3, random(-zConstrain, zConstrain), Math.floor(random(1, 101))));
    //     pokemons.push(new Pokemon("diglett", diglettShadow, random(-xConstrain, xConstrain), 0.35, random(-zConstrain, zConstrain), Math.floor(random(1, 101))));
    //     pokemons.push(new Pokemon("bulbasaur", bulbasaurShadow, random(-xConstrain, xConstrain), 0.25, random(-zConstrain, zConstrain), Math.floor(random(1, 101))));
    //     pokemons.push(new Pokemon("magnemite", magnemiteShadow, random(-xConstrain, xConstrain), random(0.5, 1), random(-zConstrain, zConstrain), Math.floor(random(1, 101))));
    //     pokemons.push(new Pokemon("pikachu", pikachuShadow, random(-xConstrain, xConstrain), 0.295, random(-zConstrain, zConstrain), Math.floor(random(1, 101))));
    //     pokemons.push(new Pokemon("slowpoke", slowpokeShadow, random(-xConstrain, xConstrain), 0.15, random(-zConstrain, zConstrain), Math.floor(random(1, 101))));
    // }

    // add all Pokemon objects to our world
    // for (var i = 0; i < pokemons.length; i++) {
    //     world.add(pokemons[i].container);
    // }

    // grab a reference to our marker in the HTML document
    poliwagMarker = world.getMarker("poliwagMarker");
    diglettMarker = world.getMarker("diglettMarker");
    bulbasaurMarker = world.getMarker("bulbasaurMarker");
    magnemiteMarker = world.getMarker("magnemiteMarker");
    pikachuMarker = world.getMarker("pikachuMarker");
    zbMarker = world.getMarker("zbMarker");
    pokemonMarkers.push(poliwagMarker); pokemonMarkers.push(diglettMarker); pokemonMarkers.push(bulbasaurMarker); pokemonMarkers.push(magnemiteMarker); pokemonMarkers.push(pikachuMarker);

    // instantiate object and add to marker
    poliwag = new MarkerPokemon("poliwag", 0, 0.3, 0, -90);      
    diglett = new MarkerPokemon("diglett", 0, 0.35, 0, -90);   
    bulbasaur = new MarkerPokemon("bulbasaur", 0, 0.25, 0, -90); 
    magnemite = new MarkerPokemon("magnemite", 0, 0.5, 0, -90);  
    pikachu = new MarkerPokemon("pikachu", 0, 0.295, 0, -90);    
    poliwagMarker.addChild(poliwag.container);
    diglettMarker.addChild(diglett.container);
    bulbasaurMarker.addChild(bulbasaur.container);
    magnemiteMarker.addChild(magnemite.container);
    pikachuMarker.addChild(pikachu.container);
    zbMarker.addChild(floor);

    // add all Pokemon objects to our world
    // for (var i = 0; i < pokemons.length; i++) {
    //     world.add(pokemons[i].container);
    // }

    // create a static container that will always be visible to the user even if marker is not being detected
    staticContainer = new Container3D({
        x: 0, y: 0, z: 0 // should the x, y, and z coordinates be based on the floor tag then? 
    });

    // add the static container to the world
    world.scene.appendChild(staticContainer.tag); // what is tag? 
}

function draw() {

    // mova and animate all Pokemons
    for (var i = 0; i < pokemons.length; i++) {
        pokemons[i].animate();
        pokemons[i].move();
        pokemons[i].layBabies();

        // pregant egg
        if (pokemons[i].pregnant == true) {pokemons[i].containerArray[pokemons[i].containerArray.length - 1].show();}
        else {pokemons[i].containerArray[pokemons[i].containerArray.length - 1].hide();}

        pokemons[i].growAmount = pokemons[i].grow();
        pokemons[i].container.setScale(scaleFactor * pokemons[i].growAmount, scaleFactor * pokemons[i].growAmount, scaleFactor * pokemons[i].growAmount);
    }

    // for loop to iterate through all markers
    for (var i = 0; i < pokemonMarkers.length; i++) {

        if (pokemonMarkers[i].isVisible()) {

            // which static container are we closest to? (I don't think we need these)
            var markerPosition = new THREE.Vector3().setFromMatrixPosition(pikachuMarker.tag.object3D.matrixWorld);
            var s1Position = new THREE.Vector3().setFromMatrixPosition(staticContainer.tag.object3D.matrixWorld);

            // staticContainer
            if (cooldown <= 0) {

              // convert to local coordinates within staticContainer
              var p = new THREE.Vector3();
              p.setFromMatrixPosition(pikachu.container.tag.object3D.matrixWorld); // flying problem? 
              p = staticContainer.tag.object3D.worldToLocal(p);

              var temp = new Pokemon(pokemonNames[i], pikachuShadow, random(-xConstrain, xConstrain), random(-2.5, 2.5), -zConstrain, Math.floor(random(1, 101)));
              staticContainer.addChild(temp.container);
              pokemons.push(temp);

              // indicate that we are in 'cooldown' mode
              cooldown = 60;
            }

            // process cooldown counter
            cooldown--;
            if (cooldown < 0) {
                cooldown = 0;
            }
        }
    }
}