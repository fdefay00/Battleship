var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	guesses: 0,
	misses: [],
	
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],

	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			// Check to see if the ship has already been hit.
			if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				this.guesses++;
				view.displayHit(guess);
				view.displayMessage("HIT!");
				view.displayStat();

				if (this.isSunk(ship)) {
					view.displayMessage("You sank one of my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		if(this.misses.indexOf(guess) < 0){
			this.misses.push(guess);
			this.guesses++;
			view.displayStat();
			view.displayMiss(guess);
			view.displayMessage("You missed.");
			return false;
		}
	},

	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++)  {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
	    return true;
	},

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},
	
	//helper function
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
}; 


var view = {
	displayMessage: function(msg) {
		var messagearea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	},

	displayStat: function() {
		var statArea = document.getElementById("stat");
		statArea.innerHTML = "total ships: "+ model.numShips+" | ships sunk: "+ model.shipsSunk+" | guess: "+ model.guesses;
	}

}; 

var controller = {

	fireGuess: function(location) {
		var hit = model.fire(location);
		if (hit && model.shipsSunk === model.numShips) {
			view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses. Refresh to restart game.");
			var cells = document.getElementsByTagName("td"); 
			for (var i = 0; i < cells.length; i++){
				cells[i].onclick = function() {
				    return false;
				};
			}
		}		
	}
}

// init - called when the page has completed loading

window.onload = function() {	
	model.generateShipLocations();
	view.displayStat();
	//Handle click on board to guess
	var cells = document.getElementsByTagName("td"); 
	for (var i = 0; i < cells.length; i++){
		cells[i].onclick = function clickToFire(e){
			//get id of cell from event
			cellid = e.target.id;
			//provide id as guess
			controller.fireGuess(cellid);
		}
	}
}
