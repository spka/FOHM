function postMap(map) {

	// console.log(map);

    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'http://localhost/map.php', true);
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

	if (game.input.activePointer.leftButton.isDown) {

	var locX = game.math.snapToFloor((pointer.x - sprite.x), 16) / 16;
	var locY = game.math.snapToFloor((pointer.y - sprite.y), 16) / 16;
	var maxTileWidth = sprite.width / 16;

    currentTile = locX + (locY * maxTileWidth);

    // console.log(locX, locY, sprite.width);
    // console.log(sprite.key, 'tileselect: ', pointer);
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
	// console.log(game.input.activePointer);
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

    cursorMarker.x = layer.getTileX(game.input.activePointer.worldX) * 16;
    cursorMarker.y = layer.getTileY(game.input.activePointer.worldY) * 16;

    // game.world.bringToTop(cursorMarker);

    if(currentTile != undefined && game.input.activePointer.rightButton.isDown && currentPointerTarget == 'layermap1') {

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
