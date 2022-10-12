import {Mesh, Vector2} from "../src/index.js";

export default scene => {
	const environment = [
		new Mesh.Hill({
			type: 1,
			position: new Vector2(16, 32),
		}),
		new Mesh.Hill({
			type: 1,
			position: new Vector2(91, 32),
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