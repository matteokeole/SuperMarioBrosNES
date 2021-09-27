// init
const Game = {
	setLevelPattern: function(lvl) {
		// set a level by using a block pattern
		// work only with 10-sized arrays!
		let x = 0, y = 0;
		for (let i = lvl.length - 1; i >= 0; i--) {
			for (let j = 0; j < lvl[i].length; j++) {
				if (lvl[i][j] !== 0) {
					// ignores a blocks
					let block = document.createElement("div");
					block.className = `block ${lvl[i][j]} ${lvl[i][j]}-${i}-${j}`;
					block.style.bottom = `${y}px`;
					block.style.left = `${x}px`;
					map.appendChild(block)
				}
				x += 48 // next element
			}
			x = 0; // return to the start of the row
			y += 48 // next column
		}
	},
	setEnvironment: function() {
		// add decorative elements
		const environment = document.querySelector(".environment"),
		bushes = [{
				class: "bush-3",
				pos: 6
			}, {
				class: "bush-2",
				pos: 252
			}, {
				class: "bush-1",
				pos: 522
		}],
		clouds = [{
				class: "cloud-1",
				pos: -96
			}, {
				class: "cloud-2",
				pos: -144
			}, {
				class: "cloud-3",
				pos: -240
		}],
		hills = [{
				class: "hill-2",
				pos: 48
			}, {
				class: "hill-2",
				pos: 273
			}, {
				class: "hill-1",
				pos: 573
		}];
		// decorative bushes
		bushes.forEach(function(e) {
			let bush = document.createElement("div");
			bush.className = `bush ${e.class}`;
			bush.style.left = `${e.pos}px`;
			environment.appendChild(bush)
		});
		// moving clouds in the background
		clouds.forEach(function(e, i) {
			let cloud = document.createElement("div");
			cloud.className = `cloud ${e.class}`;
			cloud.style.left = `${e.pos}px`;
			environment.appendChild(cloud)
		});
		// decorative hills
		hills.forEach(function(e) {
			let hill = document.createElement("div");
			hill.className = `hill ${e.class}`;
			hill.style.left = `${e.pos}px`;
			environment.appendChild(hill)
		})
	},
	keydown: function(e) {
		switch (e.keyCode) {
			// left arrow, Q key
			case 37:
			case 81:
				dirLeft = true;
				break;
			// right arrow, D key
			case 39:
			case 68:
				dirRight = true
		}
	},
	keydownJump: function(e) {
		if (e.keyCode === 32) {
			canJump = false;
			isJumping = true
		}
	},
	keyup: function(e) {
		switch (e.keyCode) {
			// left arrow, Q key
			case 37:
			case 81:
				dirLeft = false;
				break;
			// right arrow, D key
			case 39:
			case 68:
				dirRight = false;
				break;
			// spacebar
			case 32:
				isJumping = false;
				canJump = true
		}
	},
	togglePauseMenu: function() {
		if (pause.style.visibility === "hidden") {
			// showing pause menu, blocking player control
			paused = true;
			Game.freeze();
			pause.style.visibility = "visible"
		} else {
			// hiding pause menu, allowing player control
			paused = false;
			if (spawned) Game.unfreeze();
			pause.style.visibility = "hidden"
		}
	},
	unfreeze: function() {
		// enable controls
		if (!canLoop) {
			document.addEventListener("keydown", Game.keydown);
			(canJump) ? document.addEventListener("keydown", Game.keydownJump) : document.removeEventListener("keydown", Game.keydownJump); // jump handler
			document.addEventListener("keyup", Game.keyup);
			canLoop = window.requestAnimationFrame(Game.loop)
		}
	},
	loop: function() {
		canLoop = undefined;
		Player.sprite.style.backgroundImage = "url(assets/entity/mario-idle.png)";

		rawX = (posX * 48).toFixed();
		rawY = (posY * 48).toFixed();

		block.aboveLeft = block.calcAboveLeft();
		block.aboveRight = block.calcAboveRight();
		block.leftTop = block.calcLeftTop();
		block.leftBottom = block.calcLeftBottom();
		block.rightTop = block.calcRightTop();
		block.rightBottom = block.calcRightBottom();
		block.belowLeft = block.calcBelowLeft();
		block.belowRight = block.calcBelowRight();

		// movement handlers
		if (!isDefined(block.leftTop) && !isDefined(block.leftBottom)) canMoveLeft = true;
		if (!isDefined(block.rightTop) && !isDefined(block.rightBottom)) canMoveRight = true;

		// left movement event
		if (dirLeft && canMoveLeft) {
			canMoveRight = true;
			posX -= Player.speed;
			// sprite direction
			Player.sprite.style["-webkit-transform"] = "rotateY(180deg)";
			Player.sprite.style.transform = "rotateY(180deg)";
			// searching for collisions
			if (posX <= 0) posX = 0; // border collision
			if (isDefined(block.leftTop) || isDefined(block.leftBottom)) {
				canMoveLeft = false;
				if (posX % 1 !== 0) posX -= (posX % 1) - 1 // avoid sticking
			}
		}

		// right movement event
		if (dirRight && canMoveRight) {
			canMoveLeft = true;
			posX += Player.speed;
			// sprite direction
			Player.sprite.style["-webkit-transform"] = "rotateY(0)";
			Player.sprite.style.transform = "rotateY(0)";
			// searching for collisions
			if (posX >= lvlRightBorder) posX = lvlRightBorder; // border collision
			if (isDefined(block.rightTop) || isDefined(block.rightBottom)) {
				canMoveRight = false;
				if (posX % 1 !== 0) posX -= (posX % 1) // avoid sticking
			}
		}

		// jump event
		if (isJumping) Player.sprite.style.backgroundImage = "url(assets/entity/mario-jump.png)";
		canJump = (!isDefined(block.aboveLeft) && !isDefined(block.aboveRight));
		if (canJump && isJumping) {
			canJump = false;
			posY += Player.jumpSpeed
		}

		// jump reach event
		if (isJumping && (isDefined(block.aboveLeft) || isDefined(block.aboveRight))) isJumping = false;

		// fall event
		isFalling = (!isJumping && !isDefined(block.belowLeft) && !isDefined(block.belowRight));
		if (isFalling) {
			canJump = false;
			posY -= Player.fallSpeed;
			if (posY === 0) {
				canMoveLeft = false;
				canMoveRight = false;
				posY = 2;
				// Player.sprite.style.visibility = "hidden";
				// Player.sprite.style["-webkit-animation"] = "fall 1s";
				Player.sprite.style.animation = "playerFall"
			}
		}

		Player.sprite.style.bottom = `${rawY}px`;
		Player.sprite.style.left = `${rawX}px`;
		debug.innerHTML =
			`<u>PosX:</u> ${posX.toFixed()}<br>
			<u>PosY:</u> ${posY.toFixed()}<br>
			<u>RawX:</u> ${rawX}<br>
			<u>RawY:</u> ${rawY}<br>
			<u>canJump:</u> ${canJump}<br>
			<u>isJumping:</u> ${isJumping}`;
		Game.unfreeze()
	},
	freeze: function() {
		// disable controls
		if (canLoop) {
			window.cancelAnimationFrame(canLoop);
			canLoop = undefined
		}
		document.removeEventListener("keydown", Game.keydown);
		document.removeEventListener("keydown", Game.keydownJump);
		document.removeEventListener("keyup", Game.keyup)
	}
},
Player = {
	sprite: document.querySelector(".player"), // player element
	speed: (6 / 48), // base speed
	jumpSpeed: (6 / 48), // base jump speed
	fallSpeed: (6 / 48) // base fall speed
},
isDefined = function(e) {
	// check if the targeted element is either empty, border or part of the environment
	return !(e === 0 || e === undefined || e.includes("behind"))
},
block = {
	// calculate collisions coming from above, left, right and below
	aboveLeft: undefined,
	calcAboveLeft: function() {
		let request = [
			Math.ceil(lvl.length - posY - 2),
			Math.floor(posX)
		], query = lvl[request[0]][request[1]];
		try {
			document.querySelectorAll(".map .above-left").forEach(function(e) {e.classList.remove("above-left")}); // removing old collision class
			document.querySelector(`.${query}-${request[0]}-${request[1]}`).classList.add("above-left")
		} catch (e) {}
		return query
	},
	aboveRight: undefined,
	calcAboveRight: function() {
		let request = [
			Math.ceil(lvl.length - posY - 2),
			Math.ceil(posX)
		], query = lvl[request[0]][request[1]];
		try {
			document.querySelectorAll(".map .above-right").forEach(function(e) {e.classList.remove("above-right")}); // removing old collision class
			document.querySelector(`.${query}-${request[0]}-${request[1]}`).classList.add("above-right")
		} catch (e) {}
		return query
	},
	leftTop: undefined,
	calcLeftTop: function() {
		let request = [
			Math.floor(lvl.length - posY - 1),
			Math.ceil(posX - 1.2)
		], query = lvl[request[0]][request[1]];
		try {
			document.querySelectorAll(".map .left-top").forEach(function(e) {e.classList.remove("left-top")}); // removing old collision class
			document.querySelector(`.${query}-${request[0]}-${request[1]}`).classList.add("left-top")
		} catch (e) {}
		return query
	},
	leftBottom: undefined,
	calcLeftBottom: function() {
		let request = [
			Math.ceil(lvl.length - posY - 1.001),
			Math.ceil(posX - 1.2)
		], query = lvl[request[0]][request[1]];
		try {
			document.querySelectorAll(".map .left-bottom").forEach(function(e) {e.classList.remove("left-bottom")}); // removing old collision class
			document.querySelector(`.${query}-${request[0]}-${request[1]}`).classList.add("left-bottom")
		} catch (e) {}
		return query
	},
	rightTop: undefined,
	calcRightTop: function() {
		let request = [
			Math.floor(lvl.length - posY - 1),
			Math.floor(posX + 1)
		], query = lvl[request[0]][request[1]];
		try {
			document.querySelectorAll(".map .right-top").forEach(function(e) {e.classList.remove("right-top")}); // removing old collision class
			document.querySelector(`.${query}-${request[0]}-${request[1]}`).classList.add("right-top")
		} catch (e) {}
		return query
	},
	rightBottom: undefined,
	calcRightBottom: function() {
		let request = [
			Math.ceil(lvl.length - posY - 1.001),
			Math.floor(posX + 1)
		], query = lvl[request[0]][request[1]];
		try {
			document.querySelectorAll(".map .right-bottom").forEach(function(e) {e.classList.remove("right-bottom")}); // removing old collision class
			document.querySelector(`.${query}-${request[0]}-${request[1]}`).classList.add("right-bottom")
		} catch (e) {}
		return query
	},
	belowLeft: undefined,
	calcBelowLeft: function() {
		let request = [
			Math.floor(lvl.length - posY),
			Math.floor(posX)
		], query = lvl[request[0]][request[1]];
		try {
			document.querySelectorAll(".map .below-left").forEach(function(e) {e.classList.remove("below-left")}); // removing old collision class
			document.querySelector(`.${query}-${request[0]}-${request[1]}`).classList.add("below-left")
		} catch (e) {}
		return query
	},
	belowRight: undefined,
	calcBelowRight: function() {
		let request = [
			Math.floor(lvl.length - posY),
			Math.ceil(posX)
		], query = lvl[request[0]][request[1]];
		try {
			document.querySelectorAll(".map .below-right").forEach(function(e) {e.classList.remove("below-right")}); // removing old collision class
			document.querySelector(`.${query}-${request[0]}-${request[1]}`).classList.add("below-right")
		} catch (e) {}
		return query
	}
},
map = document.querySelector(".map"),
pause = document.querySelector(".pause"),
debug = document.querySelector(".debug"),
// terrain textures
G = "ground",
g = "ground behind",
B = "brick",
b = "brick behind",
M = "metal",
m = "metal behind",
E = "empty",
e = "empty behind",
Y = "mystery",
y = "mystery behind",
H = "hidden";
// coordinates, movement, jump, fall
let canLoop, // looping function
paused = true, // game paused
spawned = false, // player spawn animation end
dirLeft, // left direction
canMoveLeft = true, // can move to left
dirRight, // right direction
canMoveRight = true, // can move to right
canJump = true, // can do a jump
isJumping = false, // is jumping
isFalling = false, // is falling
posX = 2, // X start coord (based on the number of elements in the level row)
posY = 2, // Y start coord (based on the number of elements in the level column)
rawX, // X start coord (raw, * 48)
rawY; // Y start coord (raw, * 48)

// init level
// level pattern
const lvl = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, E, 0, E, B, Y, B, Y, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, M, 0, 0, 0, 0, Y, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, B, Y, B, Y, B, 0, 0, 0, 0, 0, 0, 0, M, M, G, G, 0, 0, 0, 0, 0, G, G],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, M, M, M, G, G, 0, 0, 0, 0, 0, G, G],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, M, M, M, M, G, G, G, G, G, G, G, G, G],
	[G, G, G, G, G, 0, 0, G, G, G, G, G, 0, 0, 0, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
	[G, G, G, G, G, 0, 0, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G]
],
lvlRightBorder = (lvl[lvl.length - 1].length - 1); // equals to the length of the last row

// load level
map.style.height = `${48 * lvl.length}px`;
Game.setLevelPattern(lvl);
// Game.setEnvironment();

// pause menu
document.addEventListener("keydown", function(e) {if (e.keyCode === 27) Game.togglePauseMenu()});
pause.addEventListener("mousedown", Game.togglePauseMenu);

// unfreeze after spawn animation
setTimeout(function() {
	spawned = true;
	if (!paused) Game.unfreeze()
}, /*2000*/0)