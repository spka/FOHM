function postMap(map) {

	// console.log(map);

    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'http://localhost/fohm/map.php', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhttp.send('map='+JSON.stringify(map));

}

function fetchMap(callback) {

	var xhttp = new XMLHttpRequest();
	xhttp.open('GET', 'http://localhost/map.php', true);
	
	xhttp.onload = function() {
		if (xhttp.status >= 200 && xhttp.status < 400) {
	    	// Success!
	    	console.log('fetchMap: map found!');
	    	callback(xhttp.responseText);
	  	} else {
	    	// We reached our target server, but it returned an error
	    	console.log('fetchMap: server error');
	  	}
	};

	xhttp.onerror = function() {
	  	// There was a connection error of some sort
	  	console.log('fetchMap: cant reach server');
	};

	xhttp.send();

}

function pickTile(sprite, pointer) {

	// make a map and picktile for real

	if (game.input.activePointer.rightButton.isDown && sprite.layer.name == 'layer') {

		currentTile = map.getTile(layer.getTileX(pointer.worldX), layer.getTileY(pointer.worldY), sprite.layer.name);

    	// console.log(layer.getTileX(game.input.activePointer.worldX), layer.getTileY(game.input.activePointer.worldY));
    	// console.log(sprite.key, 'tileselect: ', pointer);

	} 

	if (game.input.activePointer.rightButton.isDown && sprite.layer.name == 'tileselect') {

		var locX = game.math.snapToFloor((pointer.x - sprite.x), 16) / 16;
		var locY = game.math.snapToFloor((pointer.y - sprite.y), 16) / 16;

		currentTile = map.getTile(locX, locY, sprite.layer.name);
		// var maxTileWidth = sprite.width / 16;

    	// currentTile = locX + (locY * maxTileWidth);
    	// console.log(map.getTile(1, 1, sprite.layer.name));

    	// console.log(game.math.snapToFloor((pointer.x - sprite.x), 16) / 16);

	}

}

function activateTileStrip() {
    if(tileSelector.visible == false) {
        tileSelector.visible = true;
    } else {
        tileSelector.visible = false;
    }
}

function over(sprite, pointer) {
	currentPointerTarget = sprite.id;
	// console.log(currentPointerTarget);
}

function gofull() {

	// It takes a full second for the browserwindow to get the fullscreen
	// width and height, so resize the game after this. Then restart or 
	// reload the map to get more tiles on the screen.

	// var canvas = document.getElementsByTagName('canvas');

    if (game.scale.isFullScreen) {

        game.scale.stopFullScreen();
        game.scale.setGameSize(gameWidth, gameHeight);
        layer.resize(gameWidth, gameHeight);

    } else {

    	var canvas = document.getElementsByTagName('canvas');
		canvas[0].style.display = 'none';
        game.scale.startFullScreen();
		// console.log('canvas: ', canvas[0].width, canvas[0].height);

		setTimeout(function(){ 
			
			// console.log('window: ', window.innerWidth, window.innerHeight);
			game.scale.setGameSize(window.innerWidth, window.innerHeight);
			// console.log('canvas: ', canvas[0].width, canvas[0].height);
			// layer.resize(window.innerWidth, window.innerWidth);
			game.state.restart();
			canvas[0].style.display = 'block';
			console.log('test');

		}, 1000);
    }

}

function updateMarker(pointer) {
	// console.log(game.input.activePointer.x);


	if(currentPointerTarget == 'layermap1') {
    	cursorMarker.x = layer.getTileX(game.input.activePointer.worldX) * 16;
    	cursorMarker.y = layer.getTileY(game.input.activePointer.worldY) * 16;

    	// cursorMarker.fixedToCamera = false;
	}

	if (currentPointerTarget == 'tileselector1') {

		// console.log(Math.floor((game.input.activePointer.x - tileStrip.position.x) / 16));
		// console.log(game.input.activePointer.x, tileStrip.position.x);
		// console.log((game.input.activePointer.worldX));
		// cursorMarker.fixedToCamera = true;

		cursorMarker.x = (Math.floor((game.input.activePointer.worldX - tileStrip.position.x) / 16) * 16) + tileStrip.position.x;
    	cursorMarker.y = (Math.floor((game.input.activePointer.worldY - tileStrip.position.y) / 16) * 16) + tileStrip.position.y;

    	// check screenXY for new calc
	}

    // game.world.bringToTop(cursorMarker);

    if(currentTile != undefined && game.input.activePointer.leftButton.isDown && currentPointerTarget == 'layermap1') {

	    map.putTile(currentTile, layer.getTileX(cursorMarker.x), layer.getTileY(cursorMarker.y), layer);

	    var tiles = layer.getTiles(0, 0, map.widthInPixels, map.heightInPixels);
	    var layerHeight = layer.layer.height;
	    var csvMap = new Array();

	    for (i = 0; i < layerHeight; i++) {

	    	var tileRow = new Array;

	    	tiles.filter( function(obj) {

	    		if (obj.y == i) {
	    			tileRow.push(obj.index);
	    		}
	    	});

	    	csvMap.push(tileRow);

	    };

	    // console.log(csvMap);
	    postMap(csvMap);

	}

}

function putDefaultTiles(tilesetImage, tileWidth, tileHeight, layerName, mapVar) {

	var tilesx = game.cache.getImage(tilesetImage).width / tileWidth,
		tilesy = game.cache.getImage(tilesetImage).height / tileHeight,
		totalTiles = tilesx * tilesy;

		// console.log(totalTiles);

	// make 15 per row:
	for (var i = 0; i < (totalTiles / 10 ); i++) {
		for (var j = 0; j < 10; j++) {
			mapVar.putTile((i*10)+j, j, i, layerName);
			// console.log((i*10)+j)
		};
	};

	// make exact image proportions tilemap:
	// for (var i = 0; i < tilesy; i++) {
	// 	for (var j = 0; j < tilesx; j++) {
	// 		mapVar.putTile((tilesx * i) + j + 1, j, i, layerName);
	// 	};
	// };

}
