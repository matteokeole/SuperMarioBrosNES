// init game methods
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
					block.className = `block ${lvl[i][j]}`;
					if (!(lvl[i][j].includes("behind"))) block.classList.add(lvl[i][j] + i + j);
					block.style.bottom = `${y}px`;
					block.style.left = `${x}px`;
					map.appendChild(block)
				}
				x += 48
			}
			x = 0; // return to the left
			y += 48
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
		bushes.forEach(function(b) {
			let bush = document.createElement("div");
			bush.className = `bush ${b.class}`;
			bush.style.left = `${b.pos}px`;
			environment.appendChild(bush)
		});
		// moving clouds in the background
		clouds.forEach(function(c, i) {
			let cloud = document.createElement("div");
			cloud.className = `cloud ${c.class}`;
			cloud.style.left = `${c.pos}px`;
			environment.appendChild(cloud)
		});
		// decorative hills
		hills.forEach(function(b) {
			let hill = document.createElement("div");
			hill.className = `hill ${b.class}`;
			hill.style.left = `${b.pos}px`;
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
				dirRight = true;
				break;
			// spacebar
			case 32:
				if (!isJumping) isJumping = true
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
				isJumping = false
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
			document.addEventListener("keyup", Game.keyup);
			canLoop = window.requestAnimationFrame(Game.loop)
		}
	},
	loop: function() {
		canLoop = undefined;

		rawX = (posX * 48).toFixed();
		rawY = (posY * 48).toFixed();

		event.innerText = "No event";

		// block.aboveLeft = block.calcAboveLeft();
		// block.aboveRight = block.calcAboveRight();
		// block.leftTop = block.calcLeftTop();
		// block.leftBottom = block.calcLeftBottom();
		block.rightTop = block.calcRightTop();
		// block.rightBottom = block.calcRightBottom();
		block.belowLeft = block.calcBelowLeft();
		block.belowRight = block.calcBelowRight();

		// if (!isDefined(block.leftTop) && !isDefined(block.leftBottom)) canMoveLeft = true;
		// if (!isDefined(block.rightTop) && !isDefined(block.rightBottom)) canMoveRight = true;

		// left movement event
	/*	if (dirLeft && canMoveLeft) {
			canMoveRight = true;
			posX -= Player.speed;
			// sprite direction
			Player.sprite.style["-webkit-transform"] = "rotateY(180deg)";
			Player.sprite.style.transform = "rotateY(180deg)";
			// searching for collisions
			if (posX <= 0) posX = 0; // border collision
			if (isDefined(block.leftTop) || isDefined(block.leftBottom)) {
				canMoveLeft = false;
				if (posX % 1 !== 0) posX -= (posX % 1 - 1)
			}
		}*/

		// right movement event
		/*if (dirRight && canMoveRight) {
			canMoveLeft = true;
			posX += Player.speed;
			// sprite direction
			Player.sprite.style["-webkit-transform"] = "rotateY(0)";
			Player.sprite.style.transform = "rotateY(0)";
			// searching for collisions
			if (posX >= lvlRightBorder) posX = lvlRightBorder; // border collision
			if (isDefined(block.rightTop) || isDefined(block.rightBottom)) {
				canMoveRight = false;
				if (posX % 1 !== 0) posX -= (posX % 1)
			}
		}*/

		// jump event
		/*canJump = (!isDefined(block.aboveLeft) && !isDefined(block.aboveRight));
		if (canJump && isJumping) {
			event.innerText = "JUMPING";
			posY += Player.fallSpeed
		}
		if (isJumping) Player.sprite.style.backgroundImage = "url(assets/entity/mario-jump.png)";
		else Player.sprite.style.backgroundImage = "url(assets/entity/mario-idle.png)";*/

		// reach jump top event
		/*if (isJumping && (block.aboveLeft !== undefined || block.aboveRight !== undefined)) {
			event.innerText = "REACHED TOP";
			isJumping = false;
			canJump = false;
			isFalling = true;
		}*/

		// fall event
		isFalling = (!isJumping && !isDefined(block.belowLeft) && !isDefined(block.belowRight));
		if (isFalling && !isJumping) {
			event.innerText = "FALLING";
			posY -= Player.fallSpeed
		}

		// debug
		debug.innerHTML =
			`<u>PosX:</u> ${posX.toFixed()}<br>
			<u>PosY:</u> ${posY.toFixed()}<br>
			<u>RawX:</u> ${rawX}<br>
			<u>RawY:</u> ${rawY}<br>
			<u>Right:</u> ${canMoveRight}<br>
			<u>Left:</u> ${canMoveLeft}<br>`;

		Player.sprite.style.bottom = `${rawY}px`;
		Player.sprite.style.left = `${rawX}px`;
		Game.unfreeze()
	},
	freeze: function() {
		// disable controls
		if (canLoop) {
			window.cancelAnimationFrame(canLoop);
			canLoop = undefined
		}
		document.removeEventListener("keydown", Game.keydown);
		document.removeEventListener("keyup", Game.keyup)
	}
},
Player = {
	sprite: document.querySelector(".player"), // player element
	speed: (6 / 48), // base speed
	fallSpeed: (0.5 / 48) // base fall speed
},
isDefined = function(e) {
	// check if the targeted element is either empty or part of the environment
	return !(e === 0 || e.includes("behind"))
},
block = {
	// calculate collisions coming from above, left, right and below
	aboveLeft: undefined,
	calcAboveLeft: function() {
		document.querySelectorAll(".map .above-left").forEach(function(e) {e.classList.remove("above-left")});
		let request = [
			(-posY + (lvl.length - 2.5)).toFixed(),
			Math.floor(posX)
		];
		try {document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("above-left")}
		catch (e) {}
		return lvl[request[0]][request[1]]
	},
	aboveRight: undefined,
	calcAboveRight: function() {
		document.querySelectorAll(".map .above-right").forEach(function(e) {e.classList.remove("above-right")});
		let request = [
			(-posY + (lvl.length - 2.5)).toFixed(),
			Math.ceil(posX)
		];
		try {document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("above-right")}
		catch (e) {}
		return lvl[request[0]][request[1]]
	},
	leftTop: undefined,
	calcLeftTop: function() {
		document.querySelectorAll(".map .left-top").forEach(function(e) {e.classList.remove("left-top")});
		let request = [
			Math.ceil(posY),
			(posX - 0.6).toFixed()
		];
		try {document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("left-top")}
		catch (e) {}
		return lvl[request[0]][request[1]]
	},
	leftBottom: undefined,
	calcLeftBottom: function() {
		document.querySelectorAll(".map .left-bottom").forEach(function(e) {e.classList.remove("left-bottom")});
		let request = [
			Math.floor(posY - 0.0001),
			(posX - 0.6).toFixed()
		];
		try {document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("left-bottom")}
		catch (e) {}
		document.querySelector(".block.ground1")
		return lvl[request[0]][request[1]]
	},
	rightTop: undefined,
	calcRightTop: function() {
		document.querySelectorAll(".map .right-top").forEach(function(e) {e.classList.remove("right-top")});
		let request = [
			(lvl.length - posY - 1.5).toFixed(),
			(posX + 0.6).toFixed()
		];
		console.log(lvl.length - posY)
		// try {document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("right-top")}
		// catch (e) {}
		// return lvl[request[0]][request[1]]
	},
	rightBottom: undefined,
	calcRightBottom: function() {
		document.querySelectorAll(".map .right-bottom").forEach(function(e) {e.classList.remove("right-bottom")});
		let request = [
			Math.floor(lvl.length - posY - 0.5001),
			(posX + 0.6).toFixed()
		];
		try {document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("right-bottom")}
		catch (e) {}
		return lvl[request[0]][request[1]]
	},
	belowLeft: undefined,
	calcBelowLeft: function() {
		document.querySelectorAll(".map .below-left").forEach(function(e) {e.classList.remove("below-left")});
		let request = [
			(lvl.length - posY - 0.5).toFixed(),
			Math.floor(posX)
		];
		try {document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("below-left")}
		catch (e) {}
		return lvl[request[0]][request[1]]
	},
	belowRight: undefined,
	calcBelowRight: function() {
		document.querySelectorAll(".map .below-right").forEach(function(e) {e.classList.remove("below-right")});
		let request = [
			(lvl.length - posY - 0.5).toFixed(),
			Math.ceil(posX)
		];
		try {document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("below-right")}
		catch (e) {}
		return lvl[request[0]][request[1]]
	}
},
map = document.querySelector(".map"),
pause = document.querySelector(".pause"),
debug = document.querySelector(".debug"),
event = document.querySelector(".debug-event"),
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
canMoveLeft, // can move to left
dirRight, // right direction
canMoveRight, // can move to right
canJump, // can do a jump
isJumping, // is jumping
isFalling, // is falling
posX = 2, // X start coord (based on the number of elements in the level row)
posY = 2, // Y start coord (based on the number of elements in the level column)
rawX, // X start coord (raw, * 48)
rawY; // Y start coord (raw, * 48)

// init level
// level pattern
const lvl = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, E, 0, E, B, Y, B, Y],
	[0, 0, 0, 0, 0, 0, M, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, M],
	[0, 0, 0, 0, 0, 0, M, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, M, M],
	[0, 0, 0, 0, 0, 0, 0, Y, B, Y, B, 0, 0, 0, 0, 0, 0, M, M, M, G, G, 0, 0, 0, 0, 0, G, G],
	[0, 0, 0, 0, 0, 0, M, 0, 0, 0, 0, 0, 0, 0, 0, 0, M, M, M, M, G, G, 0, 0, 0, 0, 0, G, G],
	[0, 0, 0, M, 0, 0, 0, 0, 0, M, 0, 0, 0, 0, 0, M, M, M, M, M, G, G, G, G, G, G, G, G, G],
	[G, G, G, G, g, g, g, G, G, G, G, G, g, g, g, g, g, G, G, G, G, G, G, G, G, G, G, G, G],
	[G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G]
],
lvlRightBorder = (lvl[lvl.length - 1].length - 1); // equals to the length of the last row

// load level
Game.setLevelPattern(lvl);
Game.setEnvironment();

// pause menu
document.addEventListener("keydown", function(e) {if (e.keyCode === 27) Game.togglePauseMenu()});
pause.addEventListener("mousedown", Game.togglePauseMenu);

// unfreeze after spawn animation
setTimeout(function() {
	spawned = true;
	if (!paused) Game.unfreeze()
}, 2000)