import urlJoin from "url-join";
import type { InjectionKey } from "vue";
import { reactive } from "vue";
import type { Asset, GameConfiguration } from "~/types/AkashicEngineStandalone";
import type { PseudoFile } from "~/types/PseudoFile";
import { basename, dirname, extname, resolve } from "~/utils/path";

export const useGameJSONResolverKey: InjectionKey<UseGameJSONResolverStore> = Symbol("useGameJSONResolver");

interface State {
	width: number;
	height: number;
	fps: number;
	title?: string;
	description?: string;
	pseudoFiles: PseudoFile[];
	entryAssetUri: string | null;
	assetBase: string | null;
	moduleMainScripts: { [name: string]: string };
	dependencies: string[];
	generateGameJSON: (cascadeGameConfiguration?: GameConfiguration) => GameConfiguration;
	getGameJSONFromUri: (uri: string) => Promise<GameConfiguration>;
	fetchPseudoFilesFromUri: (uri: string) => Promise<void>;
	fetchPseudoFilesFromGameJSON: (gameJSON: GameConfiguration, assetBase: string) => Promise<void>;
	addAsset: (assetId: string, asset: Asset, assetBase: string) => Promise<void>;
	removeAsset: (assetId: string) => void;
	addExtraModule: (moduleName: string, moduleScriptPaths: string[], assetBase: string) => Promise<void>;
	removeExtraModule: (moduleName: string, moduleScriptPaths: string[]) => void;
}

export function useGameJSONResolver(): State {
	/**
	 * game.json のデータを取得する
	 * @param uri game.json の uri
	 */
	const getGameJSONFromUri = async (uri: string): Promise<GameConfiguration> => {
		const res = await (await fetch(uri)).json();
		return res as GameConfiguration;
	};

	/**
	 * game.json の Uri から state を更新する
	 * @param uri game.json の uri
	 */
	const fetchPseudoFilesFromUri = async (uri: string): Promise<void> => {
		const gameJSON = await getGameJSONFromUri(uri);
		return fetchPseudoFilesFromGameJSON(gameJSON, dirname(uri));
	};

	/**
	 * game.json のデータから state を更新する
	 * @param gameJSON game.json のデータ
	 * @param assetBase アセットベース
	 */
	const fetchPseudoFilesFromGameJSON = async (gameJSON: GameConfiguration, assetBase: string): Promise<void> => {
		const assetsMap = { ...gameJSON.assets };

		const assets = Object.keys(assetsMap).map(assetId => {
			return {
				id: assetId,
				...assetsMap[assetId]
			};
		});

		const dummyUrl = "http://127.0.0.1";
		const entryUrl = resolve(dummyUrl, gameJSON.main);
		const entryAsset = assets.find(asset => {
			// NOTE: URL.resolve() によりエントリポイントと同一であるかを判定
			const assetUrl = resolve(dummyUrl, asset.path);
			return assetUrl === entryUrl;
		});

		const pseudoFiles: PseudoFile[] = (
			await Promise.all(assets.map(asset => generatePseudoFileFromAsset(asset.id, asset, assetBase)))
		).sort((a, b) => {
			const order = ["script", "text", "image", "vector-image", "audio", "binary", "unknown"];
			return order.indexOf(a.assetType) - order.indexOf(b.assetType);
		});

		if (gameJSON.globalScripts) {
			const globalScriptAssets = generateScriptAssetFromModuleScripts(gameJSON.globalScripts);
			const globalScriptFiles = await Promise.all(
				globalScriptAssets.map(globalScriptAsset =>
					generatePseudoFileFromAsset(globalScriptAsset.assetId, globalScriptAsset, assetBase)
				)
			);
			pseudoFiles.push(...globalScriptFiles);
		}

		pseudoFiles.unshift({
			assetType: "game.json",
			name: "game.json",
			filename: "game.json",
			editorType: "text",
			uri: urlJoin(assetBase, "game.json"),
			path: "game.json",
			language: "json",
			value: JSON.stringify(gameJSON, undefined, 2)
		});

		console.log("=== resolved game.json ===");
		console.log("  - game.json", gameJSON);
		console.log("  - pseudoFiles", pseudoFiles);

		// reactive state の更新
		if (gameJSON.title) {
			state.title = gameJSON.title;
		}
		if (gameJSON.description) {
			state.description = gameJSON.description;
		}
		state.pseudoFiles.splice(0, state.pseudoFiles.length);
		state.pseudoFiles.push(...pseudoFiles);
		state.entryAssetUri = entryAsset ? urlJoin(assetBase, entryAsset.path) : null;
		state.title = gameJSON.title;
		state.description = gameJSON.description;
		state.assetBase = assetBase;
		state.moduleMainScripts = { ...gameJSON.moduleMainScripts };
		state.width = gameJSON.width;
		state.height = gameJSON.height;
		state.fps = gameJSON.fps || 30;
		state.dependencies = ["g", "@akashic/trigger", "@akashic/playlog", "@akashic/pdi-types"];

		if (gameJSON.moduleMainScripts) {
			const dependencies = Object.keys(gameJSON.moduleMainScripts);
			state.dependencies.push(...dependencies);
		}
	};

	const generatePseudoFileFromAsset = async (assetId: string, asset: Asset, assetBase: string): Promise<PseudoFile> => {
		const uri = urlJoin(assetBase, asset.path);
		const filename = basename(asset.path);
		const global = !!asset.global;

		if (asset.type === "script") {
			const value = await (await fetch(uri)).text();
			const isGlobalScript = asset.path === assetId;
			const hidden = isGlobalScript;
			const readOnly = isGlobalScript;
			return {
				id: assetId,
				name: assetId,
				uri,
				assetType: asset.type,
				editorType: "text",
				path: asset.path,
				filename,
				language: "javascript",
				value,
				global,
				hidden,
				readOnly
			};
		} else if (asset.type === "text") {
			const value = await (await fetch(uri)).text();
			return {
				id: assetId,
				name: assetId,
				uri,
				assetType: asset.type,
				editorType: "text",
				path: asset.path,
				filename,
				language: extname(uri) === ".json" ? "json" : "text",
				value,
				global
			};
		} else if (asset.type === "image" || asset.type === "vector-image") {
			const blob = await (await fetch(uri)).blob();
			return {
				id: assetId,
				name: assetId,
				uri,
				assetType: asset.type,
				editorType: "image",
				path: asset.path,
				filename,
				blob,
				width: asset.width as number,
				height: asset.height as number,
				hint: asset.hint,
				global
			};
		} else if (asset.type === "audio") {
			// FIXME: generateGameJSON() と処理が重複している。統一すべき。
			const hint = asset.hint ? { ...asset.hint } : { extensions: undefined };
			hint.extensions ??= [".ogg", ".aac"]; // FIXME: この値についてはどこかで定数化しておくべきかもしれない
			return {
				id: assetId,
				name: assetId,
				uri,
				assetType: asset.type,
				editorType: "audio",
				path: asset.path,
				filename,
				duration: asset.duration || 0,
				hint,
				systemId: asset.systemId,
				loop: !!asset.loop,
				global
			};
		} else if (asset.type === "binary") {
			const blob = await (await fetch(uri)).blob();
			return {
				id: assetId,
				name: assetId,
				uri,
				assetType: asset.type,
				editorType: "binary",
				path: asset.path,
				filename,
				blob,
				global
			};
		} else {
			return {
				id: assetId,
				uri,
				name: assetId,
				filename,
				assetType: "unknown",
				editorType: "unknown",
				path: asset.path,
				global
			};
		}
	};

	/**
	 * game.json のデータを生成する
	 * FIXME: 改善の余地あり
	 */
	const generateGameJSON = (cascadeGameJSON?: GameConfiguration): GameConfiguration => {
		if (cascadeGameJSON) {
			// 一旦以下のみ動的に変更する
			state.width = cascadeGameJSON.width;
			state.height = cascadeGameJSON.height;
			state.fps = cascadeGameJSON.fps || 30;
		}

		const gameJSON: GameConfiguration = {
			width: state.width,
			height: state.height,
			fps: state.fps,
			main: "",
			assets: {},
			moduleMainScripts: state.moduleMainScripts
		};

		for (let i = 0; i < state.pseudoFiles.length; i++) {
			const asset = state.pseudoFiles[i];
			if (asset.assetType === "script") {
				gameJSON.assets[asset.id] = {
					type: "script",
					path: asset.path,
					global: asset.global
				};
				// TODO: もう少しなんとかできる箇所
				if (state.entryAssetUri === asset.uri) {
					gameJSON.main = "./" + asset.path;
				}
			} else if (asset.assetType === "text") {
				gameJSON.assets[asset.id] = {
					type: "text",
					path: asset.path,
					global: asset.global
				};
			} else if (asset.assetType === "image") {
				gameJSON.assets[asset.id] = {
					type: "image",
					path: asset.path,
					width: asset.width,
					height: asset.height,
					hint: asset.hint,
					global: asset.global
				};
			} else if (asset.assetType === "vector-image") {
				gameJSON.assets[asset.id] = {
					type: "vector-image",
					path: asset.path,
					width: asset.width,
					height: asset.height,
					hint: asset.hint,
					global: asset.global
				};
			} else if (asset.assetType === "audio") {
				const hint = asset.hint ? { ...asset.hint } : { extensions: undefined };
				hint.extensions ??= [".ogg", ".aac"]; // FIXME: この値についてはどこかで定数化しておくべきかもしれない
				gameJSON.assets[asset.id] = {
					type: "audio",
					path: asset.path,
					duration: asset.duration,
					systemId: asset.systemId,
					hint,
					global: asset.global
				};
			} else if (asset.assetType === "binary") {
				gameJSON.assets[asset.id] = {
					type: "binary",
					path: asset.path,
					global: asset.global
				};
			}
		}
		return normalizeGlobalScripts(gameJSON);
	};

	const addAsset = async (assetId: string, asset: Asset, assetBase: string): Promise<void> => {
		const file = await generatePseudoFileFromAsset(assetId, asset, assetBase);
		state.pseudoFiles.push(file);
	};

	const removeAsset = (assetId: string): void => {
		state.pseudoFiles.some((file, i) => {
			if (file.assetType !== "game.json" && file.id === assetId) {
				state.pseudoFiles.splice(i, 1);
				return true;
			}
		});
	};

	/**
	 * moduleScriptPaths の第0要素を moduleMainScripts として扱う
	 */
	const addExtraModule = async (moduleName: string, moduleScriptPaths: string[], assetBase: string): Promise<void> => {
		state.moduleMainScripts[moduleName] = moduleScriptPaths[0];
		const globalScriptAssets = generateScriptAssetFromModuleScripts(moduleScriptPaths);
		for (const globalScriptAsset of globalScriptAssets) {
			await addAsset(globalScriptAsset.assetId, globalScriptAsset, assetBase);
		}
		if (state.dependencies.indexOf(moduleName) === -1) {
			state.dependencies.push(moduleName);
		}
	};

	const removeExtraModule = (moduleName: string, moduleScriptPaths: string[]): void => {
		delete state.moduleMainScripts[moduleName];
		for (const path of moduleScriptPaths) {
			removeAsset(path);
		}
		const index = state.dependencies.indexOf(moduleName);
		if (index !== -1) {
			state.dependencies.splice(index, 1);
		}
	};

	const generateScriptAssetFromModuleScripts = (moduleScriptPaths: string[]): (Asset & { assetId: string })[] => {
		return moduleScriptPaths.map(path => ({
			type: "script" as "script",
			assetId: path,
			path,
			global: true
		}));
	};

	const state = reactive<State>({
		width: 320,
		height: 320,
		fps: 30,
		pseudoFiles: [],
		entryAssetUri: null,
		assetBase: null,
		title: undefined,
		description: undefined,
		moduleMainScripts: {},
		dependencies: [],
		getGameJSONFromUri,
		fetchPseudoFilesFromUri,
		fetchPseudoFilesFromGameJSON,
		generateGameJSON,
		addAsset,
		removeAsset,
		addExtraModule,
		removeExtraModule
	});

	return state;
}

/**
 * game.json の globalScripts フィールドをアセットに変換する
 * @param gameJSON game.json の値
 */
function normalizeGlobalScripts(gameJSON: GameConfiguration): GameConfiguration {
	if (gameJSON.globalScripts && gameJSON.globalScripts.length) {
		for (let i = 0; i < gameJSON.globalScripts.length; i++) {
			gameJSON.assets[gameJSON.globalScripts[i]] = {
				type: "script",
				path: gameJSON.globalScripts[i],
				global: true
			};
		}
		delete gameJSON.globalScripts;
	}
	return gameJSON;
}

export type UseGameJSONResolverStore = ReturnType<typeof useGameJSONResolver>;
