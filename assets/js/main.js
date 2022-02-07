// Init level pattern
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
	[0, H, H, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, M, M, Y, G, G, g, G, G, G, G, G, G],
	[0, H, H, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, M, M, M, m, g, g, g, G, G, G, G, G, G],
	[G, G, G, G, G, G, g, g, g, g, g, G, G, G, 0, 0, G, G, G, g, g, g, g, G, G, G, G, G, G],
	[G, G, G, G, G, G, G, G, G, G, G, G, G, G, 0, 0, G, G, G, G, G, G, G, G, G, G, G, G, G]
],
lvlRightBorder = (lvl[9].length - 1); // Equals to the length of the last row

// Spawn player
Entity[0].setPosition = [1.5, 4];
Entity[0].setState = "spawning";

// Load level
Game.setLevelPattern(lvl);
Game.setEnvironment();

// Pause menu
addEventListener("keydown", e => {
	if (e.keyCode === 27) Game.togglePauseMenu()
});
pause.addEventListener("mousedown", Game.togglePauseMenu);

// Unfreeze game after player spawn animation
setTimeout(() => {
	spawned = true;
	if (!paused) Game.unfreeze()
}, 1000);

// Create goomba
// const goomba1 = new Goomba(1, [7, 1], "left")