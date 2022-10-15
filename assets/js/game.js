const Game = {
	fps: 70,
	u: 48,
	setLevelPattern: lvl => {
		// Generate a level with a block pattern
		let x = 0, y = 0;
		for (let i = lvl.length - 1; i >= 0; i--) {
			for (let j = 0; j < lvl[i].length; j++) {
				if (lvl[i][j]) {
					// Ignore air blocks
					let block = document.createElement("div");
					block.className = `block ${lvl[i][j]} ${lvl[i][j]}-${i}-${j}`;
					block.style.left = `${x}px`;
					block.style.bottom = `${y}px`;
					map.appendChild(block)
				}
				x += Game.u // Move to next element in the row
			}
			x = 0; // Row beginning
			y += Game.u // Move to next column
		}
	},
	setEnvironment: () => {
		// Generate decorative elements in the background
		const bushes = [{
				class: "bush-3",
				posX: 6
			}, {
				class: "bush-2",
				posX: 252
		}],
		clouds = [{
				class: "cloud-1",
				posX: -96
			}, {
				class: "cloud-2",
				posX: -144
			}, {
				class: "cloud-3",
				posX: -240
		}],
		hills = [{
				class: "hill-2",
				posX: 48
			}, {
				class: "hill-2",
				posX: 273
		}];
		// Decorative bushes
		bushes.forEach(e => {
			let bush = document.createElement("div");
			bush.className = `bush ${e.class}`;
			bush.style.left = `${e.posX}px`;
			environment.appendChild(bush)
		});
		// Moving clouds
		clouds.forEach(e => {
			let cloud = document.createElement("div");
			cloud.className = `cloud ${e.class}`;
			cloud.style.left = `${e.posX}px`;
			environment.appendChild(cloud)
		});
		// Decorative hills
		hills.forEach(e => {
			let hill = document.createElement("div");
			hill.className = `hill ${e.class}`;
			hill.style.left = `${e.posX}px`;
			environment.appendChild(hill)
		})
	},
	/**
	 * Key down input
	 */
	keydown: e => {
		switch (e.code) {
			// Left arrow, Q key
			case "ArrowLeft":
			case "KeyA":
				dirLeft = true;

				break;
			// Right arrow, D key
			case "ArrowRight":
			case "KeyD":
				dirRight = true;

				break;
		}
	},
	/**
	 * Key down jump input
	 */
	keydownJump: e => {
		if (e.code !== "Space") return;

		jumpReleased = false;
		canJump = false;
		isJumping = true;
	},
	/**
	 * Key up input
	 */
	keyup: e => {
		switch (e.code) {
			// Left arrow, Q key
			case "ArrowLeft":
			case "KeyA":
				dirLeft = false;

				break;
			// Right arrow, D key
			case "ArrowRight":
			case "KeyD":
				dirRight = false;

				break;
			// Spacebar
			case "Space":
				jumpReleased = true;
				canJump = true;
				isJumping = false;

				break;
		}
	},
	/**
	 * Toggle pause menu display
	 */
	togglePauseMenu: () => {
		if (pause.style.visibility === "hidden") {
			// Show pause menu & block player control
			paused = true;
			Game.freeze();
			pause.style.visibility = "visible";

			return;
		}

		// Hide pause menu & allow player control
		paused = false;
		spawned && Game.unfreeze();
		pause.style.visibility = "hidden";
	},
	/**
	 * Enable player input
	 */
	unfreeze: () => {
		if (canLoop) return;

		addEventListener("keydown", Game.keydown);
		addEventListener("keyup", Game.keyup);

		// Jump handler
		canJump && jumpReleased ?
			addEventListener("keydown", Game.keydownJump) :
			removeEventListener("keydown", Game.keydownJump);

		canLoop = setTimeout(Game.loop, 1000 / Game.fps);
	},
	loop: () => {
		// Render function (started by Game.unfreeze() and paused by Game.freeze())
		canLoop = null;

		// Player death event
		if (Entity[0].isDead && !Entity[0].isDeathAnimEnded) {
			Game.freeze();
			Entity[0].isDeathAnimEnded = true;
			// Entity[0].sprite.style.visibility = "hidden";
			Entity[0].setState = "deathFromFall";
			setTimeout(() => Entity[0].setState = "death", 500);

			return;
		}

		Game.unfreeze();

		Entity[0].setState = "idle";

		posX = Entity[0].x;
		posY = Entity[0].y;
		let rawX = posX * Game.u;
		let rawY = posY * Game.u;

		// Calculate player collisions
		let collisions = [];
		if (!Entity[0].isDead) Entity[0].collisions = calcCollisions(Entity[0]);
		// highlightCollisions(Entity[0]);

		// Movement handlers
		if (!isDefined(Entity[0].collisions.lt) && !isDefined(Entity[0].collisions.lb)) canMoveLeft = true;
		if (!isDefined(Entity[0].collisions.rt) && !isDefined(Entity[0].collisions.rb)) canMoveRight = true;

		// Left movement event
		if (dirLeft) {
			// Sprite animation & direction
			Entity[0].setState = "walking";
			Entity[0].setRotation = 180;
			if (canMoveLeft) {
				canMoveRight = true;
				posX -= Entity[0].speedRaw;
				// Looking for collisions
				if (posX <= 0) posX = 0; // Border collision
				if (isDefined(Entity[0].collisions.lt) || isDefined(Entity[0].collisions.lb)) {
					canMoveLeft = false;
					if (posX % 1 !== 0) posX -= (posX % 1) - 1 // Avoid sticking
				}
			}
		}

		// Right movement event
		if (dirRight) {
			// Sprite animation & direction
			Entity[0].setState = "walking";
			Entity[0].setRotation = 0;
			if (canMoveRight) {
				canMoveLeft = true;
				posX += Entity[0].speedRaw;
				// Looking for collisions
				if (posX >= lvlRightBorder) posX = lvlRightBorder; // Border collision
				if (isDefined(Entity[0].collisions.rt) || isDefined(Entity[0].collisions.rb)) {
					canMoveRight = false;
					if (posX % 1 !== 0) posX -= (posX % 1) // Avoid sticking
				}
			}
		}

		// Idle event
		if (!dirLeft && !dirRight) Entity[0].setState = "idle";

		// Jump event
		if (!jumpReleased || isJumping || isFalling) Entity[0].setState = "jumping";
		canJump = (!isDefined(Entity[0].collisions.tl) && !isDefined(Entity[0].collisions.tr));
		if (canJump && isJumping) {
			canJump = false;
			posY += Entity[0].jumpSpeedRaw;
			setTimeout(() => isJumping = false, 400);
		}

		// Hit block while jumping event
		if (isJumping && (isDefined(Entity[0].collisions.tl) || isDefined(Entity[0].collisions.tr))) {
			// If the block is a brick block or a mystery block it gets popped
			// Case 1: the player hits 1 hittable block
			const tl = Entity[0].collisions.tl;
			const tr = Entity[0].collisions.tr;
			let e;
			if (hittableBlocks.test(tl?.className) && !hittableBlocks.test(tr?.className)) {
				// Left collision with a brick block or mystery block
				e = tl;
				e.classList.add("pop");
				setTimeout(() => e.classList.remove("pop"), 200);
				if (e.classList.contains("mystery")) giveItem(e);
			}
			if (!hittableBlocks.test(tl?.className) && hittableBlocks.test(tr?.className)) {
				// Right collision with a brick block or mystery block
				e = tr;
				e.classList.add("pop");
				setTimeout(() => e.classList.remove("pop"), 200);
				if (e.classList.contains("mystery")) giveItem(e);
			}
			// Case 2: the player hits 2 blocks but only 1 can be animated at a time so a choice must be made
			if (hittableBlocks.test(tl?.className) && hittableBlocks.test(tr?.className)) {
				if (rawX % Game.u < Game.u / 2) {
					// Left collision with a brick block or mystery block
					e = tl;
					e.classList.add("pop");
					setTimeout(() => e.classList.remove("pop"), 200);
					if (e.classList.contains("mystery")) giveItem(e);
				} else if (rawX % Game.u >= Game.u / 2) {
					// Right collision with a brick block or mystery block
					e = tr;
					e.classList.add("pop");
					setTimeout(() => e.classList.remove("pop"), 200);
					if (e.classList.contains("mystery")) giveItem(e);
				}
			}
			isJumping = false
		}

		// Player fall event
		isFalling = (!isJumping && !isDefined(Entity[0].collisions.bl) && !isDefined(Entity[0].collisions.br) && !Entity[0].isDead);
		if (isFalling) {
			canJump = false;
			posY -= Entity[0].fallSpeedRaw;
			if (posY < 0.5 && !isDefined(Entity[0].collisions.bl) && !isDefined(Entity[0].collisions.br)) Entity[0].isDead = true
		}

		// Update player position
		Entity[0].setPosition = [posX, posY];

		// Check if some goombas are defined
		/*for (const entity of Object.values(Entity)) {
			if (entity?.type !== "goomba") continue;

			const goombaElement = document.querySelector(`.goomba-${entity.id}`);

			switch (entity.dir) {
				case "left":
					entity.posX -= entity.speed;

					break;
				case "right":
					entity.posX += entity.speed;

					break;
			}

			goombaElement.style.left = `${entity.posX * Game.u}px`;
			goombaElement.style.bottom = `${entity.posY * Game.u}px`;
		}*/

		// Debug
		debug.innerHTML = `
			<span>POS X:</span> ${posX.toFixed(2)}<br>
			<span>POS Y:</span> ${posY.toFixed(2)}<br><br>
			<span>FALLING:</span> ${isFalling}<br><br>
			<span>TOP....LEFT..:</span> ${!!Entity[0].collisions.tl}<br>
			<span>TOP....RIGHT.:</span> ${!!Entity[0].collisions.tr}<br>
			<span>RIGHT..TOP...:</span> ${!!Entity[0].collisions.rt}<br>
			<span>RIGHT..BOTTOM:</span> ${!!Entity[0].collisions.rb}<br>
			<span>BOTTOM.RIGHT.:</span> ${!!Entity[0].collisions.br}<br>
			<span>BOTTOM.LEFT..:</span> ${!!Entity[0].collisions.bl}<br>
			<span>LEFT...BOTTOM:</span> ${!!Entity[0].collisions.lb}<br>
			<span>LEFT...TOP...:</span> ${!!Entity[0].collisions.lt}<br>
		`;
	},
	freeze: () => {
		// Death function
		if (Entity[0].isDead) {
			Entity[0].sprite.style.visibility = "hidden";
			Entity[0].setState = "deathFromFall";
			setTimeout(() => Entity[0].setState = "death", 500);
		}

		// Disable player input
		if (canLoop) {
			clearTimeout(canLoop);

			canLoop = null;
		}

		removeEventListener("keydown", Game.keydown);
		removeEventListener("keydown", Game.keydownJump);
		removeEventListener("keyup", Game.keyup);
	}
},
/**
 * Return true if the target element is decorative, is a map border or is empty
 * 
 * @param	{HTMLElement|false}	target
 * @return	{boolean}
 */
isDefined = target => !(target === false),
/**
 * Calculates collisions coming from above, left, right and below the target.
 * Returns an object with found collisions.
 * 
 * @param	{HTMLElement}	target
 * @return	{object}
 */
calcCollisions = target => ({
	tl: Collision.calcTopLeft(target),
	tr: Collision.calcTopRight(target),
	rt: Collision.calcRightTop(target),
	rb: Collision.calcRightBottom(target),
	br: Collision.calcBottomRight(target),
	bl: Collision.calcBottomLeft(target),
	lb: Collision.calcLeftBottom(target),
	lt: Collision.calcLeftTop(target),
}),
Collision = {
	// Calculate collisions coming from above, left, right and below
	calcTopLeft: target => {
		let request = [
			Math.ceil(lvl.length - target.y - 2),
			Math.floor(target.x)
		], query = false;
		try {
			if (!lvl[request[0]][request[1]].includes("behind"))
				query = map.querySelector(`.${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`)
		}
		catch (e) {}
		return query
	},
	calcTopRight: target => {
		let request = [
			Math.ceil(lvl.length - target.y - 2),
			Math.ceil(target.x)
		], query = false;
		try {
			if (!lvl[request[0]][request[1]].includes("behind"))
				query = map.querySelector(`.${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`)
		}
		catch (e) {}
		return query
	},
	calcLeftTop: target => {
		let request = [
			Math.floor(lvl.length - target.y - 1),
			Math.ceil(target.x - 1.2)
		], query = false;
		try {
			if (!lvl[request[0]][request[1]].includes("behind"))
				query = map.querySelector(`.${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`)
		}
		catch (e) {}
		return query
	},
	calcLeftBottom: target => {
		let request = [
			Math.ceil(lvl.length - target.y - 1.01),
			Math.ceil(target.x - 1.2)
		], query = false;
		try {
			if (!lvl[request[0]][request[1]].includes("behind"))
				query = map.querySelector(`.${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`)
		}
		catch (e) {}
		return query
	},
	calcRightTop: target => {
		let request = [
			Math.floor(lvl.length - target.y - 1),
			Math.floor(target.x + 1)
		], query = false;
		try {
			if (!lvl[request[0]][request[1]].includes("behind"))
				query = map.querySelector(`.${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`)
		}
		catch (e) {}
		return query
	},
	calcRightBottom: target => {
		let request = [
			Math.ceil(lvl.length - target.y - 1.01),
			Math.floor(target.x + 1)
		], query = false;
		try {
			if (!lvl[request[0]][request[1]].includes("behind"))
				query = map.querySelector(`.${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`)
		}
		catch (e) {}
		return query
	},
	calcBottomLeft: target => {
		let request = [
			Math.floor(lvl.length - target.y),
			Math.floor(target.x)
		], query = false;
		try {
			if (!lvl[request[0]][request[1]].includes("behind"))
				query = map.querySelector(`.${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`)
		}
		catch (e) {}
		return query
	},
	calcBottomRight: target => {
		let request = [
			Math.floor(lvl.length - target.y),
			Math.ceil(target.x)
		], query = false;
		try {
			if (!lvl[request[0]][request[1]].includes("behind"))
				query = map.querySelector(`.${lvl[request[0]][request[1]]}-${request[0]}-${request[1]}`)
		}
		catch (e) {}
		return query
	}
},
highlightCollisions = target => {
	// Highlight collision objects near a specific target
	const collisions = Object.values(target.collisions);
	for (let i in collisions) {
		const collisionClass = Object.keys(target.collisions)[i];
		// Remove old collision highlights
		map.querySelectorAll(`.${collisionClass}`).forEach(e => {e.classList.remove(collisionClass)});
		if (collisions[i]) {
			// Highlight current collisions
			collisions[i].classList.add(collisionClass)
		}
	}
},
giveItem = e => {
	// Change the hit mystery blocks by steel blocks
	let indexes = /\d+-\d+/g.exec(e.className)[0];
	indexes = indexes.split("-");
	lvl[indexes[0]][indexes[1]] = "steel"; // Replace the array element by "steel"
	e.className = e.className.replace(/mystery/g, "steel"); // Replace "mystery" by "steel"
},
map = document.querySelector("#map"),
environment = document.querySelector("#environment"),
pause = document.querySelector("#pause"),
debug = document.querySelector("#debug"),
hittableBlocks = /(block|mystery)/, // Hittable blocks regexp
// Terrain textures
G = "ground",
g = "behind ground",
B = "brick",
b = "behind brick",
M = "metal",
m = "behind metal",
S = "steel",
s = "behind steel",
Y = "mystery",
y = "behind mystery",
H = "hidden",
Entity = [{
	sprite: document.querySelector("#player"), // DOM element
	x: 0,
	y: 0,
	collisions: {},
	rotation: 0,
	state: "idle",
	speed: 6, // Base speed
	jumpSpeed: 6, // Base jump speed
	fallSpeed: 6, // Base fall speed
	isDead: false, // Is dead
	isDeathAnimEnded: false, // Is death animation ended
	get speedRaw() {return (this.speed / Game.u)}, // Get raw speed
	get jumpSpeedRaw() {return (this.jumpSpeed / Game.u)}, // Get raw jump speed
	get fallSpeedRaw() {return (this.fallSpeed / Game.u)}, // Get raw fall speed
	set setPosition(pos) {
		/** Set the player X and Y coordinates
		 * @param {array} pos - X and Y coordinates array, unity-based
		 */
		this.x = pos[0];
		this.y = pos[1];
		this.sprite.style.left = `${this.x * Game.u}px`;
		this.sprite.style.bottom = `${this.y * Game.u}px`
	},
	set setRotation(rot) {
		/** Rotate the player by Y-axis
		 * @param {number} rot - Rotation value, from 0 to 180 deg
		 */
		this.rotation = rot;
		const rotation = `rotateY(${this.rotation}deg)`;
		this.sprite.style.transform = rotation
	},
	set setState(state) {
		/** Set an animation state for the player
		 * @param {string} state (idle|walking|skidding|jumping|falling) - State name
		 */
		this.state = state;
		this.sprite.className = this.state
	},
}],
Goomba = function(id, [posX, posY], dir, speed = 2) {
	/** Create a new goomba
	 * @param {number} id - Goomba's unique ID, will be added as a class to the DOM element
	 * @param {number} posX - Spawn X coordinate
	 * @param {number} posY - Spawn Y coordinate
	 * @param {string} dir (left|right) - X-axis direction which will be followed by the goomba until it falls, touches the map border or die
	 * @param {number} speed - Speed value, default is 2
	 */
	speed /= Game.u;
	let goomba = {
		type: "goomba",
		id: id,
		posX: posX,
		posY: posY,
		dir: dir,
		speed: speed
	};
	Entity.push(goomba);
	let e = document.createElement("div");
	e.className = `goomba goomba-${id}`;
	e.style.left = `${posX * Game.u}px`;
	e.style.bottom = `${posY * Game.u}px`;
	map.appendChild(e)
};

let canLoop,					// Looping function
	paused			= true,		// Game paused
	spawned			= false,	// Player spawn animation end
	dirLeft,					// Left direction
	canMoveLeft		= true,		// Can move to left
	dirRight,					// Right direction
	canMoveRight	= true,		// Can move to right
	jumpReleased	= true,		// Is spacebar released
	canJump			= true,		// Can do a jump
	isJumping		= false,	// Is jumping
	isFalling		= false;	// Is falling