import fetchMock from "jest-fetch-mock";
import { useGameJSONResolver } from "~/composables/useGameJSONResolver";
import type { GameConfiguration } from "~/types/AkashicEngineStandalone";
import type {
	PseudoAudioAssetFile,
	PseudoBinaryAssetFile,
	PseudoGameJSONFile,
	PseudoImageAssetFile,
	PseudoScriptAssetFile,
	PseudoTextAssetFile,
	PseudoUnknownAssetFile
} from "~/types/PseudoFile";

describe("useGameJSONResolver", () => {
	beforeAll(() => {
		fetchMock.enableMocks();
	});

	beforeEach(() => {
		fetchMock.resetMocks();
	});

	test("resolves game.json", async () => {
		fetchMock.mockResponse((req: Request): any => {
			switch (req.url) {
				case "base/script/main.js":
					return Promise.resolve("dummy data (base/script/main.js)");
				case "base/text/text.txt":
					return Promise.resolve("dummy data (base/text/text.txt)");
				case "base/text/json.json":
					return Promise.resolve(JSON.stringify({ data: "dummy data (base/text/json.json)" }));
				case "base/image/image.png":
					return Promise.resolve(Buffer.from([]));
				case "base/bin/data.bin":
					return Promise.resolve(Buffer.from([]));
				default:
					return Promise.reject(new Error("Not Found"));
			}
		});

		const gameConfiguration: GameConfiguration = {
			title: "game title",
			description: "game description",
			width: 1280,
			height: 720,
			fps: 60,
			main: "./script/main.js",
			assets: {
				main: {
					type: "script",
					path: "script/main.js",
					global: true
				},
				text: {
					type: "text",
					path: "text/text.txt"
				},
				json: {
					type: "text",
					path: "text/json.json"
				},
				image: {
					type: "image",
					path: "image/image.png",
					width: 430,
					height: 110,
					hint: {
						untainted: true
					}
				},
				se: {
					type: "audio",
					path: "audio/se",
					duration: 1000,
					systemId: "sound",
					hint: {
						prop: "se"
					}
				},
				bgm: {
					type: "audio",
					path: "audio/bgm",
					duration: 25000,
					systemId: "music",
					hint: {
						extensions: [".ogg", ".m4a", ".aac"],
						prop: "bgm"
					}
				},
				bin: {
					type: "binary",
					path: "bin/data.bin",
					hint: {
						prop: "bin"
					}
				},
				unknown: {
					type: "unknown" as any,
					path: "unknown"
				}
			}
		};

		const gameJSONResolver = useGameJSONResolver();
		await gameJSONResolver.fetchPseudoFilesFromGameJSON(gameConfiguration, "base");

		expect(gameJSONResolver.title).toBe("game title");
		expect(gameJSONResolver.description).toBe("game description");
		expect(gameJSONResolver.width).toBe(1280);
		expect(gameJSONResolver.height).toBe(720);
		expect(gameJSONResolver.fps).toBe(60);
		expect(gameJSONResolver.entryAssetUri).toBe("base/script/main.js");
		expect(gameJSONResolver.assetBase).toBe("base");

		// game.json
		const [
			// game.json
			gameJSONFile,
			// main.js
			mainFile,
			// text.txt
			textFile,
			// json.json
			jsonFile,
			// image.png,
			imageFile,
			// se
			seFile,
			// bgm
			bgmFile,
			// data.bin
			binFile,
			// unknown
			unknownFile
		] = gameJSONResolver.pseudoFiles;

		const gameJSON = gameJSONFile as PseudoGameJSONFile;
		expect(gameJSON.assetType).toBe("game.json");
		expect(gameJSON.editorType).toBe("text");
		expect(JSON.parse(gameJSON.value)).toEqual(gameConfiguration);

		const main = mainFile as PseudoScriptAssetFile;
		expect(main.assetType).toBe("script");
		expect(main.editorType).toBe("text");
		expect(main.filename).toBe("main.js");
		expect(main.language).toBe("javascript");
		expect(main.global).toBe(true);
		expect(main.value).toBe("dummy data (base/script/main.js)");

		const text = textFile as PseudoTextAssetFile;
		expect(text.assetType).toBe("text");
		expect(text.editorType).toBe("text");
		expect(text.filename).toBe("text.txt");
		expect(text.language).toBe("text");
		expect(text.global).toBe(false);
		expect(text.value).toBe("dummy data (base/text/text.txt)");

		const json = jsonFile as PseudoTextAssetFile;
		expect(json.assetType).toBe("text");
		expect(json.editorType).toBe("text");
		expect(json.filename).toBe("json.json");
		expect(json.language).toBe("json");
		expect(json.global).toBe(false);
		expect(JSON.parse(json.value)).toEqual({ data: "dummy data (base/text/json.json)" });

		const image = imageFile as PseudoImageAssetFile;
		expect(image.assetType).toBe("image");
		expect(image.editorType).toBe("image");
		expect(image.filename).toBe("image.png");
		expect(image.width).toBe(430);
		expect(image.height).toBe(110);
		expect(image.hint).toEqual({
			untainted: true
		});
		expect(image.global).toBe(false);

		const se = seFile as PseudoAudioAssetFile;
		expect(se.assetType).toBe("audio");
		expect(se.editorType).toBe("audio");
		expect(se.systemId).toBe("sound");
		expect(se.duration).toBe(1000);
		expect(se.filename).toBe("se");
		expect(se.hint).toEqual({
			extensions: [".ogg", ".aac"],
			prop: "se"
		});
		expect(se.global).toBe(false);

		const bgm = bgmFile as PseudoAudioAssetFile;
		expect(bgm.assetType).toBe("audio");
		expect(bgm.editorType).toBe("audio");
		expect(bgm.systemId).toBe("music");
		expect(bgm.duration).toBe(25000);
		expect(bgm.filename).toBe("bgm");
		expect(bgm.hint).toEqual({
			extensions: [".ogg", ".m4a", ".aac"],
			prop: "bgm"
		});
		expect(bgm.global).toBe(false);

		const bin = binFile as PseudoBinaryAssetFile;
		expect(bin.assetType).toBe("binary");
		expect(bin.editorType).toBe("binary");
		expect(bin.global).toBe(false);

		const unknown = unknownFile as PseudoUnknownAssetFile;
		expect(unknown.assetType).toBe("unknown");
		expect(unknown.editorType).toBe("unknown");
	});

	test("adds/removes assets", async () => {
		fetchMock.mockResponse((req: Request): any => {
			switch (req.url) {
				case "base/script/main.js":
					return Promise.resolve("dummy data (base/script/main.js)");
				case "base/text/text.txt":
					return Promise.resolve("dummy data (base/text/text.txt)");
				case "base/text/json.json":
					return Promise.resolve(JSON.stringify({ data: "dummy data (base/text/json.json)" }));
				default:
					return Promise.reject(new Error("Not Found"));
			}
		});

		const gameConfiguration: GameConfiguration = {
			title: "game title",
			description: "game description",
			width: 1280,
			height: 720,
			fps: 60,
			main: "./script/main.js",
			assets: {
				main: {
					type: "script",
					path: "script/main.js",
					global: true
				}
			}
		};

		const gameJSONResolver = useGameJSONResolver();
		await gameJSONResolver.fetchPseudoFilesFromGameJSON(gameConfiguration, "base");

		expect(gameJSONResolver.pseudoFiles.length).toBe(2);

		await gameJSONResolver.addAsset(
			"text",
			{
				type: "text",
				path: "text/text.txt"
			},
			"base"
		);

		await gameJSONResolver.addAsset(
			"json",
			{
				type: "text",
				path: "text/json.json"
			},
			"base"
		);

		expect(gameJSONResolver.pseudoFiles.length).toBe(4);
		const textFile = gameJSONResolver.pseudoFiles[2] as PseudoTextAssetFile;
		expect(textFile.value).toBe("dummy data (base/text/text.txt)");
		const jsonFile = gameJSONResolver.pseudoFiles[3] as PseudoTextAssetFile;
		expect(JSON.parse(jsonFile.value)).toEqual({ data: "dummy data (base/text/json.json)" });

		expect(gameJSONResolver.generateGameJSON().assets).toEqual({
			main: {
				type: "script",
				path: "script/main.js",
				global: true
			},
			json: {
				type: "text",
				path: "text/json.json",
				global: false
			},
			text: {
				type: "text",
				path: "text/text.txt",
				global: false
			}
		});

		gameJSONResolver.removeAsset(jsonFile.id);

		expect(gameJSONResolver.pseudoFiles.length).toBe(3);
		expect(gameJSONResolver.generateGameJSON().assets).toEqual({
			main: {
				type: "script",
				path: "script/main.js",
				global: true
			},
			text: {
				type: "text",
				path: "text/text.txt",
				global: false
			}
		});
	});

	test("adds/removes extraLibs", async () => {
		fetchMock.mockResponse((req: Request): any => {
			switch (req.url) {
				case "base/script/main.js":
					return Promise.resolve("dummy data (base/script/main.js)");
				case "base/node_modules/@scoped/extra-lib/lib/index.js":
					return Promise.resolve("dummy data (base/node_modules/lib/index.js)");
				case "base/node_modules/@scoped/extra-lib/lib/module1.js":
					return Promise.resolve("dummy data (base/node_modules/lib/module1.js)");
				case "base/node_modules/@scoped/extra-lib/lib/module2.js":
					return Promise.resolve("dummy data (base/node_modules/lib/module2.js)");
				case "base/node_modules/@scoped/extra-lib/lib/module3.js":
					return Promise.resolve("dummy data (base/node_modules/lib/module3.js)");
				default:
					return Promise.reject(new Error("Not Found"));
			}
		});

		const gameConfiguration: GameConfiguration = {
			title: "game title",
			description: "game description",
			width: 1280,
			height: 720,
			fps: 60,
			main: "./script/main.js",
			assets: {
				main: {
					type: "script",
					path: "script/main.js",
					global: true
				}
			}
		};

		const gameJSONResolver = useGameJSONResolver();
		await gameJSONResolver.fetchPseudoFilesFromGameJSON(gameConfiguration, "base");

		expect(gameJSONResolver.pseudoFiles.length).toBe(2);
		expect(gameJSONResolver.moduleMainScripts).toEqual({});

		await gameJSONResolver.addExtraModule(
			"@scoped/extra-lib",
			[
				"node_modules/@scoped/extra-lib/lib/index.js",
				"node_modules/@scoped/extra-lib/lib/module1.js",
				"node_modules/@scoped/extra-lib/lib/module2.js",
				"node_modules/@scoped/extra-lib/lib/module3.js"
			],
			"base"
		);

		expect(gameJSONResolver.dependencies).toEqual([
			"g",
			"@akashic/trigger",
			"@akashic/playlog",
			"@akashic/pdi-types",
			"@scoped/extra-lib"
		]);

		expect(gameJSONResolver.pseudoFiles.length).toBe(6);
		expect(gameJSONResolver.pseudoFiles[2].filename).toBe("index.js");
		expect(gameJSONResolver.pseudoFiles[2].assetType).toBe("script");
		expect(gameJSONResolver.pseudoFiles[3].filename).toBe("module1.js");
		expect(gameJSONResolver.pseudoFiles[3].assetType).toBe("script");
		expect(gameJSONResolver.pseudoFiles[4].filename).toBe("module2.js");
		expect(gameJSONResolver.pseudoFiles[4].assetType).toBe("script");
		expect(gameJSONResolver.pseudoFiles[5].filename).toBe("module3.js");
		expect(gameJSONResolver.pseudoFiles[5].assetType).toBe("script");

		gameJSONResolver.removeExtraModule("@scoped/extra-lib", [
			"node_modules/@scoped/extra-lib/lib/index.js",
			"node_modules/@scoped/extra-lib/lib/module1.js",
			"node_modules/@scoped/extra-lib/lib/module2.js",
			"node_modules/@scoped/extra-lib/lib/module3.js"
		]);

		expect(gameJSONResolver.dependencies).toEqual(["g", "@akashic/trigger", "@akashic/playlog", "@akashic/pdi-types"]);

		expect(gameJSONResolver.pseudoFiles.length).toBe(2);
	});
});
