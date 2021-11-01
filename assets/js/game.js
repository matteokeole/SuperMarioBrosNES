const Game = {
	fps: 70,
	u: 48,
	setLevelPattern: function(lvl) {
		// Generate a level with a block pattern
		let x = 0, y = 0;
		for (let i = lvl.length - 1; i >= 0; i--) {
			for (let j = 0; j < lvl[i].length; j++) {
				if (lvl[i][j] !== 0) {
					// Ignore air blocks
					let block = document.createElement("div");
					block.className = `block ${lvl[i][j]} ${lvl[i][j]}-${i}-${j}`;
					block.style.bottom = `${y}px`;
					block.style.left = `${x}px`;
					map.appendChild(block)
				}
				x += Game.u // Next element in the row
			}
			x = 0; // Row beginning
			y += Game.u // Next column
		}
	},
	setEnvironment: function() {
		// Generate decorative elements in the background
		const bushes = [{
				class: "bush-3",
				pos: 6
			}, {
				class: "bush-2",
				pos: 252
			}/*, {
				class: "bush-1",
				pos: 522
		}*/],
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
			}/*, {
				class: "hill-1",
				pos: 573
		}*/];
		// Decorative bushes
		bushes.forEach(function(e) {
			let bush = document.createElement("div");
			bush.className = `bush ${e.class}`;
			bush.style.left = `${e.pos}px`;
			environment.appendChild(bush)
		});
		// Moving clouds
		clouds.forEach(function(e, i) {
			let cloud = document.createElement("div");
			cloud.className = `cloud ${e.class}`;
			cloud.style.left = `${e.pos}px`;
			environment.appendChild(cloud)
		});
		// Decorative hills
		hills.forEach(function(e) {
			let hill = document.createElement("div");
			hill.className = `hill ${e.class}`;
			hill.style.left = `${e.pos}px`;
			environment.appendChild(hill)
		})
	},
	keydown: function(e) {
		// User key down input
		switch (e.keyCode) {
			// Left arrow, Q key
			case 37:
			case 81:
				dirLeft = true;
				break;
			// Right arrow, D key
			case 39:
			case 68:
				dirRight = true
		}
	},
	keydownJump: function(e) {
		// User key down spacebar input
		if (e.keyCode === 32) {
			jumpReleased = false;
			canJump = false;
			isJumping = true
		}
	},
	keyup: function(e) {
		// User key up input
		switch (e.keyCode) {
			// Left arrow, Q key
			case 37:
			case 81:
				dirLeft = false;
				break;
			// Right arrow, D key
			case 39:
			case 68:
				dirRight = false;
				break;
			// Spacebar
			case 32:
				jumpReleased = true;
				canJump = true;
				isJumping = false
		}
	},
	togglePauseMenu: function() {
		// Toggle pause menu display
		if (pause.style.visibility === "hidden") {
			// Show pause menu & block player control
			paused = true;
			Game.freeze();
			pause.style.visibility = "visible"
		} else {
			// Hide pause menu & allow player control
			paused = false;
			if (spawned) Game.unfreeze();
			pause.style.visibility = "hidden"
		}
	},
	unfreeze: function() {
		// Enable player input
		if (!canLoop) {
			addEventListener("keydown", Game.keydown);
			// Jump handler
			if (canJump && jumpReleased) addEventListener("keydown", Game.keydownJump);
			else removeEventListener("keydown", Game.keydownJump);
			addEventListener("keyup", Game.keyup);
			canLoop = setTimeout(Game.loop, 1000 / Game.fps)
		}
	},
	loop: function() {
		// Render function (started by Game.unfreeze() and ended by Game.freeze())
		canLoop = undefined;
		Player.sprite.style.backgroundImage = "url(assets/textures/entity/mario-idle.png)";

		rawX = (Game.u * posX).toFixed();
		rawY = (Game.u * posY).toFixed();

		if (!Player.dead) {
			block.aboveLeft = block.calcAboveLeft();
			block.aboveRight = block.calcAboveRight();
			block.leftTop = block.calcLeftTop();
			block.leftBottom = block.calcLeftBottom();
			block.rightTop = block.calcRightTop();
			block.rightBottom = block.calcRightBottom();
			block.belowLeft = block.calcBelowLeft();
			block.belowRight = block.calcBelowRight()
		}

		// Movement handlers
		if (!isDefined(block.leftTop) && !isDefined(block.leftBottom)) canMoveLeft = true;
		if (!isDefined(block.rightTop) && !isDefined(block.rightBottom)) canMoveRight = true;

		// Left movement event
		if (dirLeft) {
			// Sprite animation & direction
			Player.sprite.style["-webkit-animation-name"] = "playerWalk";
			Player.sprite.style["-webkit-animation-duration"] = "0.3s";
			Player.sprite.style["animationIterationCount"] = "infinite";
			Player.sprite.style.animationName = "playerWalk";
			Player.sprite.style.animationDuration = "0.3s";
			Player.sprite.style.animationIterationCount = "infinite";
			Player.sprite.style["-webkit-transform"] = "rotateY(180deg)";
			Player.sprite.style.transform = "rotateY(180deg)";
			if (canMoveLeft) {
				canMoveRight = true;
				posX -= Player.speedRaw;
				// Looking for collisions
				if (posX <= 0) posX = 0; // Border collision
				if (isDefined(block.leftTop) || isDefined(block.leftBottom)) {
					canMoveLeft = false;
					if (posX % 1 !== 0) posX -= (posX % 1) - 1 // Avoid sticking
				}
			}
		}

		// Right movement event
		if (dirRight) {
			// Sprite animation & direction
			Player.sprite.style["-webkit-animation-name"] = "playerWalk";
			Player.sprite.style["-webkit-animation-duration"] = "0.3s";
			Player.sprite.style["animationIterationCount"] = "infinite";
			Player.sprite.style.animationName = "playerWalk";
			Player.sprite.style.animationDuration = "0.3s";
			Player.sprite.style.animationIterationCount = "infinite";
			Player.sprite.style["-webkit-transform"] = "rotateY(0)";
			Player.sprite.style.transform = "rotateY(0)";
			if (canMoveRight) {
				canMoveLeft = true;
				posX += Player.speedRaw;
				// Looking for collisions
				if (posX >= lvlRightBorder) posX = lvlRightBorder; // Border collision
				if (isDefined(block.rightTop) || isDefined(block.rightBottom)) {
					canMoveRight = false;
					if (posX % 1 !== 0) posX -= (posX % 1) // Avoid sticking
				}
			}
		}

		// Idle event
		if (!dirLeft && !dirRight) {
			Player.sprite.style["animationIterationCount"] = 1;
			Player.sprite.style.animationIterationCount = 1;
			Player.sprite.style.backgroundImage = "url(assets/textures/entity/mario-idle.png)"
		}

		// Jump event
		if (!jumpReleased || isJumping || isFalling) {
			Player.sprite.style["animationIterationCount"] = 1;
			Player.sprite.style.animationIterationCount = 1;
			Player.sprite.style.backgroundImage = "url(assets/textures/entity/mario-jump.png)"
		}
		canJump = (!isDefined(block.aboveLeft) && !isDefined(block.aboveRight));
		if (canJump && isJumping) {
			canJump = false;
			posY += Player.jumpSpeedRaw;
			setTimeout(function() {isJumping = false}, 400)
		}

		// Hit block while jumping event
		if (isJumping && (isDefined(block.aboveLeft) || isDefined(block.aboveRight))) {
			// If the block is a brick block or a mystery block, it gets animated (pop keyframe)
			// Case 1: the player hits 1 hittable block
			let e;
			if (hittableBlocks.test(block.aboveLeft) && !hittableBlocks.test(block.aboveRight)) {
				// Left collision with a brick block or mystery block
				e = document.querySelector(`.${block.aboveLeft}`);
				e.classList.add("pop");
				setTimeout(function() {e.classList.remove("pop")}, 200);
				if (e.classList.contains("mystery")) giveItem(block.aboveLeft)
			}
			if (!hittableBlocks.test(block.aboveLeft) && hittableBlocks.test(block.aboveRight)) {
				// Right collision with a brick block or mystery block
				e = document.querySelector(`.${block.aboveRight}`);
				e.classList.add("pop");
				setTimeout(function() {e.classList.remove("pop")}, 200);
				if (e.classList.contains("mystery")) giveItem(block.aboveRight)
			}
			// Case 2: the player hits 2 blocks but only 1 can be animated at a time so a choice must be made
			if (hittableBlocks.test(block.aboveLeft) && hittableBlocks.test(block.aboveRight)) {
				if ((rawX % Game.u) < (Game.u / 2)) {
					// Left collision with a brick block or mystery block
					e = document.querySelector(`.${block.aboveLeft}`);
					e.classList.add("pop");
					setTimeout(function() {e.classList.remove("pop")}, 200);
					if (e.classList.contains("mystery")) giveItem(block.aboveLeft)

				} else if ((rawX % Game.u) >= (Game.u / 2)) {
					// Right collision with a brick block or mystery block
					e = document.querySelector(`.${block.aboveRight}`);
					e.classList.add("pop");
					setTimeout(function() {e.classList.remove("pop")}, 200);
					if (e.classList.contains("mystery")) giveItem(block.aboveRight)

				}
			}
			isJumping = false
		}

		// Fall event
		isFalling = (!isJumping && !isDefined(block.belowLeft) && !isDefined(block.belowRight));
		if (isFalling) {
			canJump = false;
			posY -= Player.fallSpeedRaw;
			if (posY < 0.5 && !isDefined(block.belowLeft) && !isDefined(block.belowRight)) {
				Player.dead = true
			}
		}

		// Death event
		if (Player.dead && !Player.deathAnimEnded) {
			Game.freeze();
			Player.deathAnimEnded = true;
			Player.sprite.style.visibility = "hidden";
			Player.sprite.style["-webkit-animationName"] = "playerDeathFall";
			Player.sprite.style["-webkit-animationDuration"] = "0.5s";
			Player.sprite.style.animationName = "playerDeathFall";
			Player.sprite.style.animationDuration = "0.5s";
			setTimeout(function() {
				Player.sprite.style["animationName"] = "playerDeath";
				Player.sprite.style["animationDuration"] = "1.25s"
				Player.sprite.style.animationName = "playerDeath";
				Player.sprite.style.animationDuration = "1.25s"
			}, 500)
		} else Game.unfreeze();

		// Player position on map
		Player.sprite.style.left = `${rawX}px`;
		Player.sprite.style.bottom = `${rawY}px`;

		// Check if at least one goomba is defined
		if (Goombas.length !== 0) {
			for (let i of Goombas) {
				let goomba = document.querySelector(`.goomba-${i.id}`);
				if (i.dir === 0) {
					// Left direction
					// i.posX -= i.speed
				} else {
					// Right direction
					// i.posX += i.speed
				}
				goomba.style.left = `${i.posX * Game.u}px`;
				goomba.style.bottom = `${i.posY * Game.u}px`
			}
		}

		// Debug
		debug.innerHTML = `<span>POS_X:</span> ${posX.toFixed()}<br>
			<span>RAW_X:</span> ${rawX}<br><br>
			<span>POS_Y:</span> ${posY.toFixed()}<br>
			<span>RAW_Y:</span> ${rawY}<br>`
	},
	freeze: function() {
		/*// Death function
		if (Player.dead) {
			Player.sprite.style.visibility = "hidden";
			Player.sprite.style["-webkit-animationName"] = "playerDeathFall";
			Player.sprite.style["-webkit-animationDuration"] = "0.5s";
			Player.sprite.style.animationName = "playerDeathFall";
			Player.sprite.style.animationDuration = "0.5s";
			setTimeout(function() {
				Player.sprite.style["animationName"] = "playerDeath";
				Player.sprite.style["animationDuration"] = "1.25s"
				Player.sprite.style.animationName = "playerDeath";
				Player.sprite.style.animationDuration = "1.25s"
			}, 500)
		}*/
		// Disable player input
		if (canLoop) {
			clearTimeout(canLoop);
			canLoop = undefined
		}
		removeEventListener("keydown", Game.keydown);
		removeEventListener("keydown", Game.keydownJump);
		removeEventListener("keyup", Game.keyup);
	}
},
isDefined = function(e) {
	// Check if the targeted element is either empty, border or part of the environment
	return !(e[0] === "0" || e === undefined || e.includes("behind"))
},
block = {
	// Calculate collisions coming from above, left, right and below
	aboveLeft: undefined,
	calcAboveLeft: function() {
		let request = [
			Math.ceil(lvl.length - posY - 2),
			Math.floor(posX)
		], query = `${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`;
		try {
			document.querySelectorAll(".map .above-left").forEach(function(e) {e.classList.remove("above-left")}); // Remove all old collisions
			document.querySelector(`.${query}`).classList.add("above-left") // Add current collision
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
			document.querySelectorAll(".map .above-right").forEach(function(e) {e.classList.remove("above-right")}); // Remove all old collisions
			document.querySelector(`.${query}`).classList.add("above-right") // Add current collision
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
			document.querySelectorAll(".map .left-top").forEach(function(e) {e.classList.remove("left-top")}); // Remove all old collisions
			document.querySelector(`.${query}`).classList.add("left-top") // Add current collision
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
			document.querySelectorAll(".map .left-bottom").forEach(function(e) {e.classList.remove("left-bottom")}); // Remove all old collisions
			document.querySelector(`.${query}`).classList.add("left-bottom") // Add current collision
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
			document.querySelectorAll(".map .right-top").forEach(function(e) {e.classList.remove("right-top")}); // Remove all old collisions
			document.querySelector(`.${query}`).classList.add("right-top") // Add current collision
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
			document.querySelectorAll(".map .right-bottom").forEach(function(e) {e.classList.remove("right-bottom")}); // Remove all old collisions
			document.querySelector(`.${query}`).classList.add("right-bottom") // Add current collision
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
			document.querySelectorAll(".map .below-left").forEach(function(e) {e.classList.remove("below-left")}); // Remove all old collisions
			document.querySelector(`.${query}`).classList.add("below-left") // Add current collision
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
			document.querySelectorAll(".map .below-right").forEach(function(e) {e.classList.remove("below-right")}); // Remove all old collisions
			document.querySelector(`.${query}`).classList.add("below-right") // Add current collision
		} catch (e) {}
		return query
	}
},
giveItem = function(e) {
	// Change the hit mystery blocks by steel blocks
	let indexes = /\d+-\d+/g.exec(e)[0];
	indexes = indexes.split("-");
	lvl[indexes[0]][indexes[1]] = "steel"; // Replace the array element by "steel"
	let block = document.querySelector(`.${e}`); // Get the element with the array coords
	block.className = block.className.replace(/mystery/g, "steel") // Replace the classes that contain "mystery" by "steel"
},
map = document.querySelector(".map"),
environment = document.querySelector(".environment"),
pause = document.querySelector(".pause"),
debug = document.querySelector(".debug"),
hittableBlocks = /(brick|mystery)/, // Hittable blocks regexp
// Terrain textures
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
	sprite: document.querySelector(".player"), // Player element
	speed: 6, // Base speed
	get speedRaw() {return (this.speed / Game.u)}, // Raw speed
	jumpSpeed: 6, // Base jump speed
	get jumpSpeedRaw() {return (this.jumpSpeed / Game.u)}, // Raw jump speed
	fallSpeed: 6, // Base fall speed
	get fallSpeedRaw() {return (this.fallSpeed / Game.u)}, // Raw fall speed
	dead: false, // Is dead
	deathAnimEnded: false // Is death animation ended
},
Goomba = function(id, [posX, posY], dir, speed = 2) {
	// Init a new goomba
	// id 				Integer, goombas's id. It will be added as a class to the element
	// [posX, posY]		Spawn coordinates
	// dir				Boolean, X-axis direction. The goomba will follow it until he falls or touches the map border
	// speed 			Integer, defines the goomba's speed, default is 1
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
// Coordinates, movement, jump, fall
let canLoop, // Looping function
paused = true, // Game paused
spawned = false, // Player spawn animation end
dirLeft, // Left direction
canMoveLeft = true, // Can move to left
dirRight, // Right direction
canMoveRight = true, // Can move to right
jumpReleased = true, // Is spacebar released
canJump = true, // Can do a jump
isJumping = false, // Is jumping
isFalling = false, // Is falling
posX = 1.5, // X start coord (based on the number of elements in the level row)
posY = 4, // Y start coord (based on the number of elements in the level column)
rawX = (posX * Game.u), // X start coord (raw, * 48)
rawY = (posY * Game.u); // Y start coord (raw, * 48)

// Init level pattern
// All sub-arrays must have the same length!
const lvl = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// The 5 lines above ensure the jump limit, don't remove them
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// The lines above are used to make the window higher, can be removed
	[0, 0, 0, 0, 0, 0, S, 0, S, B, Y, B, Y, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Y, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, M, G, G, 0, 0, 0, 0, 0, G, G],
	[0, 0, 0, 0, 0, 0, B, Y, B, Y, B, 0, 0, 0, 0, 0, 0, 0, M, M, G, G, 0, 0, 0, 0, 0, G, G],
	[0, H, H, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, M, M, Y, G, G, 0, G, G, G, G, G, G],
	[0, H, H, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, M, M, M, 0, 0, 0, 0, G, G, G, G, G, G],
	[G, G, G, G, G, G, G, G, G, G, G, G, 0, 0, 0, G, G, G, G, 0, 0, 0, 0, G, G, G, G, G, G],
	[G, G, G, G, G, G, G, G, G, G, G, G, G, G, 0, G, G, G, G, G, G, G, G, G, G, G, G, G, G]
],
lvlRightBorder = (lvl[9].length - 1); // Equals to the length of the last row

Player.sprite.style.left = `${rawX}px`;
Player.sprite.style.bottom = `${rawY}px`;
// Load level
Game.setLevelPattern(lvl);
Game.setEnvironment();

// Pause menu
addEventListener("keydown", function(e) {if (e.keyCode === 27) Game.togglePauseMenu()});
pause.addEventListener("mousedown", Game.togglePauseMenu);

// Unfreeze after spawn animation
setTimeout(function() {
	spawned = true;
	if (!paused) Game.unfreeze()
}, 1000);

// Create goomba
// let goomba1 = new Goomba(1, [12, 1], 1)