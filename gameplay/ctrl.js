// init

let looping,
speed = (6 / 48), // base speed
fallingSpeed = (8 / 48), // base falling speed
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
rawY, // Y start coord (raw)
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
};
const keydown = function(e) {
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
			break
	}
},
keydownPause = function(e) {if (e.keyCode === 27) togglePause()},
keyup = function(e) {
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
			break
	}
},
enableCtrl = function() {if (!looping) looping = window.requestAnimationFrame(loopCtrl)},
loopCtrl = function(e) {
	looping = undefined;
	document.addEventListener("keydown", keydown);
	document.addEventListener("keyup", keyup);

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
		posY += fallingSpeed
	} else {}
	// if (isJumping && canJump) jump()

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
	enableCtrl()
},
disableCtrl = function() {
	if (looping) {
		window.cancelAnimationFrame(looping);
		looping = undefined
	}
	document.removeEventListener("keydown", keydown);
	document.removeEventListener("keyup", keyup)
},
jump = function() {
	console.log("JUMP")
	canJump = false;
	posY += speed;
	player.style.backgroundImage = "url(assets/sprites/entity/mario-jump.png)";
	setTimeout(function() {
		posY -= speed;
		isJumping = false
	}, 320);
	setTimeout(function() {player.style.backgroundImage = "url(assets/sprites/entity/mario-idle.png)"}, 640)
},
debug = document.querySelector("#debug"),
event = document.querySelector("#event");

document.addEventListener("keydown", keydownPause)