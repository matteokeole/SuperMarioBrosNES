const setLevelPattern = function(lvl) {
	// this sets a level by using a block pattern
	// only works with 10-sized array
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
setEnvironment = function() {
	// this adds environment elements
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
togglePause = function() {
	if (pause.style.visibility === "hidden") {
		// showing pause menu, blocking player control
		disableCtrl();
		// console.log(player.classList)
		player.classList.add("paused");
		pause.style.visibility = "visible"
	} else {
		// hiding pause menu, allowing player control
		enableCtrl();
		// console.log(player.classList)
		player.classList.remove("paused");
		pause.style.visibility = "hidden"
	}
},
a = undefined,
g = "groundBlock",
b = "brickBlock",
m = "metalBlock",
e = "emptyBlock",
h = "hiddenBlock",
$ = "mysteryBlock",
lvl = [
	// level pattern
	[a, a, a, a, a, a, a, a, a, a, a, a, a],
	[a, a, a, a, a, a, a, a, a, a, a, a, a],
	[a, a, a, a, a, a, e, a, e, b, $, b, $],
	[a, a, a, a, a, a, a, a, a, a, a, a, a, a, a, a, a, a, a, m],
	[a, a, a, a, a, a, a, a, a, a, a, a, a, a, a, a, a, a, m, m],
	[a, a, a, a, a, a, b, $, b, $, b, a, a, a, a, a, a, m, m, m],
	[a, a, m, m, b, b, b, a, a, a, a, a, a, a, a, a, m, m, m, m],
	[a, a, a, a, a, a, a, a, a, a, a, a, a, a, a, m, m, m, m, m],
	[g, g, g, g, g, g, g, g, g, g, g, g, a, a, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g],
	[g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g, g]
],
mapBorder = ((lvl[lvl.length - 1].length - 1) * 48),
map = document.querySelector(".map"),
pause = document.querySelector(".pause");

setLevelPattern(lvl);
setEnvironment();

pause.addEventListener("mousedown", togglePause);

const player = document.querySelector("div.player")