class Pokeball {
	constructor () {
		this.container = new Container3D({x: 0, y: 0, z: 0});

		// pokeball
	    var pokeball = new OBJ({
	        asset: 'pokeball_obj',
	        mtl: 'pokeball_mtl',
	        rotationX: -90,
	        scaleX: pokeballScale, scaleY: pokeballScale, scaleZ: pokeballScale
	    });

	    this.container.addChild(pokeball);
	}
}