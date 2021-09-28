// init
const Game = {
	u: 48,
	setLevelPattern: function(lvl) {
		// set a level by using a block pattern
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
				x += Game.u // next element
			}
			x = 0; // return to the start of the row
			y += Game.u // next column
		}
	},
	setEnvironment: function() {
		// add decorative elements
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
		// init decorative bushes
		bushes.forEach(function(e) {
			let bush = document.createElement("div");
			bush.className = `bush ${e.class}`;
			bush.style.left = `${e.pos}px`;
			environment.appendChild(bush)
		});
		// init moving clouds in the background
		clouds.forEach(function(e, i) {
			let cloud = document.createElement("div");
			cloud.className = `cloud ${e.class}`;
			cloud.style.left = `${e.pos}px`;
			environment.appendChild(cloud)
		});
		// init decorative hills
		hills.forEach(function(e) {
			let hill = document.createElement("div");
			hill.className = `hill ${e.class}`;
			hill.style.left = `${e.pos}px`;
			environment.appendChild(hill)
		})
	},
	keydown: function(e) {
		// user input (key down)
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
		// user spacebar input (key down)
		if (e.keyCode === 32) {
			jumpReleased = false;
			canJump = false;
			isJumping = true
		}
	},
	keyup: function(e) {
		// user input (key up)
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
				jumpReleased = true;
				canJump = true;
				isJumping = false
		}
	},
	togglePauseMenu: function() {
		// toggle pause menu display
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
		// enable player input
		if (!canLoop) {
			document.addEventListener("keydown", Game.keydown);
			// jump handler
			if (canJump && jumpReleased) {
				document.addEventListener("keydown", Game.keydownJump)
			} else {
				document.removeEventListener("keydown", Game.keydownJump)
			}
			document.addEventListener("keyup", Game.keyup);
			canLoop = window.requestAnimationFrame(Game.loop)
		}
	},
	loop: function() {
		// render function (Game.unfreeze() to start & loops until Game.freeze() is called)
		canLoop = undefined;
		Player.sprite.style.backgroundImage = "url(assets/entity/mario-idle.png)";

		rawX = (Game.u * posX).toFixed();
		rawY = (Game.u * posY).toFixed();

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
			posX -= Player.speedRaw;
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
			posX += Player.speedRaw;
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
			posY += Player.jumpSpeedRaw;
			setTimeout(function() {isJumping = false}, 400)
		}

		// hit block while jumping event
		if (isJumping && (isDefined(block.aboveLeft) || isDefined(block.aboveRight))) {
			// if the block is a brick block or a mystery block, it gets animated (pop)
			// case 1: the player hits 1 hittable block
			let e;
			if (hittableBlocks.test(block.aboveLeft) && !hittableBlocks.test(block.aboveRight)) {
				// left collision with a brick block or mystery block
				e = document.querySelector(`.${block.aboveLeft}`);
				e.classList.add("pop");
				setTimeout(function() {e.classList.remove("pop")}, 200);
				// TO-DO: random item
				if (e.classList.contains("mystery")) {
					alert("ok")
				}
			}
			if (!hittableBlocks.test(block.aboveLeft) && hittableBlocks.test(block.aboveRight)) {
				// right collision with a brick block or mystery block
				e = document.querySelector(`.${block.aboveRight}`);
				e.classList.add("pop");
				setTimeout(function() {e.classList.remove("pop")}, 200);
				// TO-DO: random item
				if (e.classList.contains("mystery")) {
					alert("ok")
				}
			}
			// case 2: the player hits 2 blocks but only 1 can be animated at a time so a choice must be made
			if (hittableBlocks.test(block.aboveLeft) && hittableBlocks.test(block.aboveRight)) {
				if ((rawX % Game.u) < (Game.u / 2)) {
					// left collision with a brick block or mystery block
					e = document.querySelector(`.${block.aboveLeft}`);
					e.classList.add("pop");
					setTimeout(function() {e.classList.remove("pop")}, 200);
					// TO-DO: random item
					if (e.classList.contains("mystery")) {
						alert("ok")
					}
				} else if ((rawX % Game.u) >= (Game.u / 2)) {
					// right collision with a brick block or mystery block
					let e = document.querySelector(`.${block.aboveRight}`);
					e.classList.add("pop");
					setTimeout(function() {e.classList.remove("pop")}, 200);
					// TO-DO: random item
					if (e.classList.contains("mystery")) {
						alert("ok")
					}
				}
			}
			isJumping = false
		}

		// fall event
		isFalling = (!isJumping && !isDefined(block.belowLeft) && !isDefined(block.belowRight));
		if (isFalling) {
			canJump = false;
			posY -= Player.fallSpeedRaw;
			if (posY < 0.5 && !isDefined(block.belowLeft) && !isDefined(block.belowRight)) {
				Player.dead = true
			}
		}

		Player.sprite.style.left = `${rawX}px`;
		Player.sprite.style.bottom = `${rawY}px`;

		// checking if at least one goomba is defined
		if (Goombas.length !== 0) {
			for (let i of Goombas) {
				let goomba = document.querySelector(`.goomba-${i.id}`);
				if (i.dir === 0) {
					// left direction
					// i.posX -= i.speed
				} else {
					// right direction
					// i.posX += i.speed
				}
				goomba.style.left = `${i.posX * Game.u}px`;
				goomba.style.bottom = `${i.posY * Game.u}px`
			}
		}

		debug.innerHTML =
			`<u>PosX:</u> ${posX.toFixed()}<br>
			<u>RawX:</u> ${rawX}<br><br>
			<u>PosY:</u> ${posY.toFixed()}<br>
			<u>RawY:</u> ${rawY}<br>`;
		(Player.dead) ? Game.freeze() : Game.unfreeze()
	},
	freeze: function() {
		// disable player input
		if (canLoop) {
			window.cancelAnimationFrame(canLoop);
			canLoop = undefined
		}
		document.removeEventListener("keydown", Game.keydown);
		document.removeEventListener("keydown", Game.keydownJump);
		document.removeEventListener("keyup", Game.keyup);
		// death function
		if (Player.dead) {
			Player.sprite.style.visibility = "hidden";
			Player.sprite.style.animation = "playerDeathFall 0.5s linear";
			setTimeout(function() {Player.sprite.style.animation = `playerDeath 1.25s linear`}, 500)
		}
	}
},
isDefined = function(e) {
	// check if the targeted element is either empty, border or part of the environment
	return !(e[0] === "0" || e === undefined || e.includes("behind"))
},
block = {
	// calculate collisions coming from above, left, right and below
	aboveLeft: undefined,
	calcAboveLeft: function() {
		let request = [
			Math.ceil(lvl.length - posY - 2),
			Math.floor(posX)
		], query = `${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`;
		try {
			document.querySelectorAll(".map .above-left").forEach(function(e) {e.classList.remove("above-left")}); // removing old collision class
			document.querySelector(`.${query}`).classList.add("above-left")
		} catch (e) {}
		return query
	},
	aboveRight: undefined,
	calcAboveRight: function() {
		let request = [
			Math.ceil(lvl.length - posY - 2),
			Math.ceil(posX)
		], query = `${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`;
		try {
			document.querySelectorAll(".map .above-right").forEach(function(e) {e.classList.remove("above-right")}); // removing old collision class
			document.querySelector(`.${query}`).classList.add("above-right")
		} catch (e) {}
		return query
	},
	leftTop: undefined,
	calcLeftTop: function() {
		let request = [
			Math.floor(lvl.length - posY - 1),
			Math.ceil(posX - 1.2)
		], query = `${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`;
		try {
			document.querySelectorAll(".map .left-top").forEach(function(e) {e.classList.remove("left-top")}); // removing old collision class
			document.querySelector(`.${query}`).classList.add("left-top")
		} catch (e) {}
		return query
	},
	leftBottom: undefined,
	calcLeftBottom: function() {
		let request = [
			Math.ceil(lvl.length - posY - 1.01),
			Math.ceil(posX - 1.2)
		], query = `${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`;
		try {
			document.querySelectorAll(".map .left-bottom").forEach(function(e) {e.classList.remove("left-bottom")}); // removing old collision class
			document.querySelector(`.${query}`).classList.add("left-bottom")
		} catch (e) {}
		return query
	},
	rightTop: undefined,
	calcRightTop: function() {
		let request = [
			Math.floor(lvl.length - posY - 1),
			Math.floor(posX + 1)
		], query = `${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`;
		try {
			document.querySelectorAll(".map .right-top").forEach(function(e) {e.classList.remove("right-top")}); // removing old collision class
			document.querySelector(`.${query}`).classList.add("right-top")
		} catch (e) {}
		return query
	},
	rightBottom: undefined,
	calcRightBottom: function() {
		let request = [
			Math.ceil(lvl.length - posY - 1.01),
			Math.floor(posX + 1)
		], query = `${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`;
		try {
			document.querySelectorAll(".map .right-bottom").forEach(function(e) {e.classList.remove("right-bottom")}); // removing old collision class
			document.querySelector(`.${query}`).classList.add("right-bottom")
		} catch (e) {}
		return query
	},
	belowLeft: undefined,
	calcBelowLeft: function() {
		let request = [
			Math.floor(lvl.length - posY),
			Math.floor(posX)
		], query = `${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`;
		try {
			document.querySelectorAll(".map .below-left").forEach(function(e) {e.classList.remove("below-left")}); // removing old collision class
			document.querySelector(`.${query}`).classList.add("below-left")
		} catch (e) {}
		return query
	},
	belowRight: undefined,
	calcBelowRight: function() {
		let request = [
			Math.floor(lvl.length - posY),
			Math.ceil(posX)
		], query = `${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`;
		try {
			document.querySelectorAll(".map .below-right").forEach(function(e) {e.classList.remove("below-right")}); // removing old collision class
			document.querySelector(`.${query}`).classList.add("below-right")
		} catch (e) {}
		return query
	}
},
map = document.querySelector(".map"),
environment = document.querySelector(".environment"),
pause = document.querySelector(".pause"),
debug = document.querySelector(".debug"),
hittableBlocks = /(brick|mystery)/, // hittable blocks regexp
// terrain textures
G = "ground",
g = "ground behind",
B = "brick",
b = "brick behind",
M = "metal",
m = "metal behind",
S = "steel",
s = "steel behind",
Y = "mystery",
y = "mystery behind",
H = "hidden",
Player = {
	sprite: document.querySelector(".player"), // player element
	speed: 6, // base speed
	get speedRaw() {return (this.speed / Game.u)}, // raw speed
	jumpSpeed: 6, // base jump speed
	get jumpSpeedRaw() {return (this.jumpSpeed / Game.u)}, // raw jump speed
	fallSpeed: 6, // base fall speed
	get fallSpeedRaw() {return (this.fallSpeed / Game.u)}, // raw fall speed
	dead: false // is dead
},
Goomba = function(id, [posX, posY], dir, speed = 2) {
	// init a new goomba
	// id 			integer, goombas's id. it will be added as a class to the element
	// posX/posY 	spawn coordinates
	// dir			boolean, X-axis direction. the goomba will follow it until he falls or touches the map border
	// speed 		integer, defines the goomba's speed, default is 1
	speed /= Game.u;
	let goomba = {
		id: id,
		posX: posX,
		posY: posY,
		dir: dir,
		speed: speed
	};
	Goombas.push(goomba);
	let e = document.createElement("div");
	e.className = `goomba goomba-${id}`;
	e.style.left = `${posX * Game.u}px`;
	e.style.bottom = `${posY * Game.u}px`;
	map.appendChild(e)
};
Goombas = [];
// coordinates, movement, jump, fall
let canLoop, // looping function
paused = true, // game paused
spawned = false, // player spawn animation end
dirLeft, // left direction
canMoveLeft = true, // can move to left
dirRight, // right direction
canMoveRight = true, // can move to right
jumpReleased = true, // is spacebar released
canJump = true, // can do a jump
isJumping = false, // is jumping
isFalling = false, // is falling
posX = 2, // X start coord (based on the number of elements in the level row)
posY = 2, // Y start coord (based on the number of elements in the level column)
rawX = (posX * Game.u), // X start coord (raw, * 48)
rawY = (posY * Game.u); // Y start coord (raw, * 48)

// init level pattern
// all sub-arrays must have the same length!
const lvl = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, S, 0, S, B, Y, B, Y, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, M, 0, 0, 0, 0, Y, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, B, Y, B, Y, B, 0, 0, 0, 0, 0, 0, 0, M, M, G, G, 0, 0, 0, 0, 0, G, G],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, M, M, M, G, G, 0, 0, 0, 0, 0, G, G],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, M, M, M, y, g, G, g, G, G, G, G, G, G],
	[G, G, G, G, G, G, G, G, G, G, G, G, g, g, g, G, G, G, G, g, g, g, g, G, G, G, G, G, G],
	[G, G, G, G, G, G, G, G, G, G, G, G, G, G, g, G, G, G, G, G, G, G, G, G, G, G, G, G, G]
],
lvlRightBorder = (lvl[9].length - 1); // equals to the length of the last row

Player.sprite.style.left = `${rawX}px`;
Player.sprite.style.bottom = `${rawY}px`;
// load level
map.style.height = `${Game.u * lvl.length}px`;
Game.setLevelPattern(lvl);
Game.setEnvironment();

// pause menu
document.addEventListener("keydown", function(e) {if (e.keyCode === 27) Game.togglePauseMenu()});
pause.addEventListener("mousedown", Game.togglePauseMenu);

// unfreeze after spawn animation
setTimeout(function() {
	spawned = true;
	if (!paused) Game.unfreeze()
}, 1500)

// Game.togglePauseMenu();

let goomba1 = new Goomba(1, [12, 1], 1)