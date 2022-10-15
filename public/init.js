import {Environment, Mesh, Vector2} from "../src/index.js";

export default scene => {
	const environment = [
		new Environment.Hill({
			type: 1,
			position: new Vector2(16, 32),
		}),
		new Environment.Hill({
			type: 0,
			position: new Vector2(112, 32),
		}),
		new Environment.Bush({
			type: 2,
			position: new Vector2(0, 32),
		}),
		new Environment.Bush({
			type: 1,
			position: new Vector2(80, 32),
		}),
		new Environment.Bush({
			type: 0,
			position: new Vector2(176, 32),
		}),
		new Environment.Cloud({
			type: 1,
			position: new Vector2(48, 192),
		}),
		new Environment.Cloud({
			type: 2,
			position: new Vector2(128, 144),
		}),
		new Environment.Cloud({
			type: 0,
			position: new Vector2(32, 112),
		}),
	];

	const meshes = [
		new Mesh.Tile({
			width: 96,
			height: 32,
			position: new Vector2(0, 0),
		}),
		new Mesh.Tile({
			width: 80,
			height: 16,
			position: new Vector2(96, 0),
		}),
		new Mesh.Tile({
			width: 48,
			height: 32,
			position: new Vector2(176, 0),
		}),
		new Mesh.Brick({
			position: new Vector2(96, 64),
		}),
		new Mesh.MysteryBlock({
			position: new Vector2(112, 64),
		}),
		new Mesh.Brick({
			position: new Vector2(128, 64),
		}),
		new Mesh.MysteryBlock({
			position: new Vector2(144, 64),
		}),
		new Mesh.Brick({
			position: new Vector2(160, 64),
		}),
		new Mesh.Steel({
			position: new Vector2(96, 112),
		}),
		new Mesh.Steel({
			position: new Vector2(128, 112),
		}),
		new Mesh.Brick({
			position: new Vector2(144, 112),
		}),
		new Mesh.MysteryBlock({
			position: new Vector2(160, 112),
		}),
		new Mesh.Brick({
			position: new Vector2(176, 112),
		}),
		new Mesh.MysteryBlock({
			position: new Vector2(192, 112),
		}),
		new Mesh.Pipe({
			width: 32,
			height: 32,
			position: new Vector2(16, 32),
		}),
	];

	// Last added objects are drawed first
	// scene.addEnvironment(...environment);
	scene.addMeshes(...meshes);
};