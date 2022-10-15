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
			width: 224,
			height: 32,
			position: new Vector2(0, 0),
		}),
		new Mesh.Pipe({
			width: 32,
			height: 32,
			position: new Vector2(16, 32),
		}),
		new Mesh.MysteryBlock({
			position: new Vector2(112, 64),
		}),
	];

	// Last added objects are drawed first
	scene.addEnvironment(...environment);
	scene.addMeshes(...meshes);
};