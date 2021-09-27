// init game methods
const Game = {
	setLevelPattern: function(lvl) {
		// set a level by using a block pattern
		// work only with 10-sized arrays!
		let x = 0, y = 336;
		for (let i = 0; i < lvl.length; i++) {
			for (let j = 0; j < lvl[i].length; j++) {
				if (lvl[i][j] !== undefined) {
					// ignores a blocks
					let block = document.createElement("div");
					block.className = `block ${lvl[i][j]} ${lvl[i][j] + i + j}`;
					block.style.bottom = `${y + 96}px`;
					block.style.left = `${x}px`;
					map.appendChild(block)
				}
				x += 48
			}
			x = 0;
			y -= 48
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
			Game.freeze();
			// console.log(player.classList)
			player.classList.add("paused");
			pause.style.visibility = "visible"
		} else {
			// hiding pause menu, allowing player control
			Game.unfreeze();
			// console.log(player.classList)
			player.classList.remove("paused");
			pause.style.visibility = "hidden"
		}
	},
	unfreeze: function() {if (!canLoop) canLoop = window.requestAnimationFrame(Game.loop)},
	loop: function() {
		canLoop = undefined;
		document.addEventListener("keydown", Game.keydown);
		document.addEventListener("keyup", Game.keyup);

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

		if (block.leftTop === undefined && block.leftBottom === undefined) canMoveLeft = true;
		if (block.rightTop === undefined && block.rightBottom === undefined) canMoveRight = true;

		// moving to left
		if (dirLeft && canMoveLeft) {
			canMoveRight = true;
			posX -= speed;
			// sprite direction
			player.style["-webkit-transform"] = "rotateY(180deg)";
			player.style.transform = "rotateY(180deg)";
			// searching for collisions
			if (posX <= 0) posX = 0; // map border
			if (block.leftTop !== undefined || block.leftBottom !== undefined) {
				canMoveLeft = false;
				if (posX % 1 !== 0) posX -= (posX % 1 - 1)
			}
		}

		// moving to right
		if (dirRight && canMoveRight) {
			canMoveLeft = true;
			posX += speed;
			// sprite direction
			player.style["-webkit-transform"] = "rotateY(0)";
			player.style.transform = "rotateY(0)";
			// searching for collisions
			if (posX >= mapBorder) posX = mapBorder; // map border
			if (block.rightTop !== undefined || block.rightBottom !== undefined) {
				canMoveRight = false;
				if (posX % 1 !== 0) posX -= (posX % 1)
			}
		}

		// falling event
		isFalling = (block.belowLeft === undefined && block.belowRight === undefined);
		if (isFalling && !isJumping) {
			event.innerText = "FALLING";
			posY -= fallingSpeed;
		} else {
			canJump = true;
			event.innerText = "No event"
		}

		// jumping event
		canJump = (block.aboveLeft === undefined && block.aboveRight === undefined);
		if (canJump && isJumping) {
			event.innerText = "JUMPING";
			player.style.backgroundImage = "url(assets/entity/mario-jump.png)";
			posY += fallingSpeed
		} else {
			event.innerText = "No event";
			player.style.backgroundImage = "url(assets/entity/mario-idle.png)"
		}

		// debug
		debug.innerHTML =
			`<u>PosX:</u> ${posX.toFixed()}<br>
			<u>PosY:</u> ${posY.toFixed()}<br>
			<u>RawX:</u> ${rawX}<br>
			<u>RawY:</u> ${rawY}<br>
			<u>Right Top:</u> ${block.rightTop}<br>
			<u>Right Bottom:</u> ${block.rightBottom}<br>
			<u>Can Jump:</u> ${canJump}<br>`;

		player.style.bottom = `${rawY}px`;
		player.style.left = `${rawX}px`;
		Game.unfreeze()
	},
	freeze: function() {
		if (canLoop) {
			window.cancelAnimationFrame(canLoop);
			canLoop = undefined
		}
		document.removeEventListener("keydown", Game.keydown);
		document.removeEventListener("keyup", Game.keyup)
	}
},
speed = (6 / 48), // base speed
fallingSpeed = (8 / 48), // base falling speed
block = {
	aboveLeft: undefined,
	calcAboveLeft: function() {
		document.querySelectorAll(".map .above-left").forEach(function(e) {e.classList.remove("above-left")});
		let request = [
			Math.ceil(-posY + 7.5),
			requestX = Math.floor(posX)
		];
		try {
			document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("above-left")
		} catch (e) {}
		return lvl[request[0]][request[1]]
	},
	aboveRight: undefined,
	calcAboveRight: function() {
		document.querySelectorAll(".map .above-right").forEach(function(e) {e.classList.remove("above-right")});
		let request = [
			Math.ceil(-posY + 7.5),
			requestX = Math.ceil(posX)
		];
		try {
			document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("above-right")
		} catch (e) {}
		return lvl[request[0]][request[1]]
	},
	leftTop: undefined,
	calcLeftTop: function() {
		document.querySelectorAll(".map .left-top").forEach(function(e) {e.classList.remove("left-top")});
		let request = [
			Math.floor(-posY + 9),
			requestX = (posX - 0.6).toFixed()
		];
		try {
			document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("left-top")
		} catch (e) {}
		return lvl[request[0]][request[1]]
	},
	leftBottom: undefined,
	calcLeftBottom: function() {
		document.querySelectorAll(".map .left-bottom").forEach(function(e) {e.classList.remove("left-bottom")});
		let request = [
			Math.ceil(-posY + 8.9999),
			requestX = (posX - 0.6).toFixed()
		];
		try {
			document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("left-bottom")
		} catch (e) {}
		return lvl[request[0]][request[1]]
	},
	rightTop: undefined,
	calcRightTop: function() {
		document.querySelectorAll(".map .right-top").forEach(function(e) {e.classList.remove("right-top")});
		let request = [
			Math.floor(-posY + 9),
			requestX = (posX + 0.6).toFixed()
		];
		try {
			document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("right-top")
		} catch (e) {}
		return lvl[request[0]][request[1]]
	},
	rightBottom: undefined,
	calcRightBottom: function() {
		document.querySelectorAll(".map .right-bottom").forEach(function(e) {e.classList.remove("right-bottom")});
		let request = [
			Math.ceil(-posY + 8.9999),
			requestX = (posX + 0.6).toFixed()
		];
		try {
			document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("right-bottom")
		} catch (e) {}
		return lvl[request[0]][request[1]]
	},
	belowLeft: undefined,
	calcBelowLeft: function() {
		document.querySelectorAll(".map .below-left").forEach(function(e) {e.classList.remove("below-left")});
		let request = [
			(-posY + 9.5).toFixed(),
			requestX = Math.floor(posX)
		];
		try {
			document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("below-left")
		} catch (e) {}
		return lvl[request[0]][request[1]]
	},
	belowRight: undefined,
	calcBelowRight: function() {
		document.querySelectorAll(".map .below-right").forEach(function(e) {e.classList.remove("below-right")});
		let request = [
			(-posY + 9.5).toFixed(),
			requestX = Math.ceil(posX)
		];
		try {
			document.querySelector(`.${lvl[request[0]][request[1]] + request[0] + request[1]}`).classList.add("below-right")
		} catch (e) {}
		return lvl[request[0]][request[1]]
	}
},
map = document.querySelector(".map"),
pause = document.querySelector(".pause"),
debug = document.querySelector("#debug"),
event = document.querySelector("#event"),
A = undefined,
G = "groundBlock",
B = "brickBlock",
M = "metalBlock",
E = "emptyBlock",
H = "hiddenBlock",
$ = "mysteryBlock";
let canLoop = false,
dirLeft = false, // left direction
canMoveLeft = true,
dirRight = false, // right direction
canMoveRight = true,
canJump = true, // can do a jump
isJumping = false, // is jumping
isFalling = false, // is falling
posX = 2, // X start coord (0-)
posY = 2, // Y start coord (0-9)
rawX, // X start coord (raw)
rawY; // Y start coord (raw)

// init level
const lvl = [
	// level pattern
	[A, A, A, A, A, A, A, A, A, A, A, A, A],
	[A, A, A, A, A, A, A, A, A, A, A, A, A],
	[A, A, A, A, A, A, A, A, A, A, $, A, $],
	[A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, M],
	[A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, M, M],
	[A, A, A, A, A, A, B, $, B, $, B, A, A, A, A, A, A, M, M, M],
	[A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, M, M, M, M],
	[A, A, A, A, A, A, A, A, A, A, A, A, A, A, A, M, M, M, M, M],
	[G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G],
	[G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G]
],
mapBorder = ((lvl[lvl.length - 1].length - 1) * 48);

// load level
Game.setLevelPattern(lvl);
Game.setEnvironment();

// pause menu
document.addEventListener("keydown", function(e) {if (e.keyCode === 27) Game.togglePauseMenu()});
pause.addEventListener("mousedown", Game.togglePauseMenu);

const player = document.querySelector("div.player")