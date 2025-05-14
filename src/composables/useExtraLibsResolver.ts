import axios from "axios";
import type { InjectionKey } from "vue";
import { reactive } from "vue";

export const useExtraLibsResolverKey: InjectionKey<UseExtraLibsResolverStore> = Symbol("useExtraLibsResolver");

interface State {
	getExtraLibUris: (version: string, moduleNames: string[]) => string[];
	fetchExtraLibsFromUris: (uris: string[]) => Promise<void>;
	extraLibs: {
		content: string;
		filePath?: string;
	}[];
}

export function useExtraLibsResolver(): State {
	const getExtraLibUris = (version: string, moduleNames: string[]): string[] => {
		// TODO: ハードコーディング
		return moduleNames
			.map<string | undefined>(name => {
				if (name === "g") {
					return `types/${version}/akashic-engine.d.ts`;
				} else if (name === "@akashic/trigger") {
					return `types/${version}/trigger.d.ts`;
				} else if (name === "@akashic/playlog") {
					return `types/${version}/playlog.d.ts`;
				} else if (name === "@akashic/pdi-types") {
					return `types/${version}/pdi-types.d.ts`;
				} else if (name === "@akashic-extension/akashic-timeline") {
					return "types/extra/akashic-timeline.d.ts";
				} else if (name === "@akashic-extension/akashic-label") {
					return "types/extra/akashic-label.d.ts";
				} else if (name === "@akashic-extension/akashic-box2d") {
					return "types/extra/akashic-box2d.d.ts";
				}
			})
			.filter((url): url is string => url != null);
	};

	const fetchExtraLibsFromUris = async (uris: string[]): Promise<void> => {
		// eslint-disable-next-line　import/no-named-as-default-member
		const reses = await axios.all(uris.map(uri => axios.get(uri)));
		state.extraLibs.splice(0, state.extraLibs.length);
		for (let i = 0; i < reses.length; i++) {
			state.extraLibs.push({
				filePath: undefined,
				content: reses[i].data
			});
		}
	};

	const state = reactive<State>({
		getExtraLibUris,
		fetchExtraLibsFromUris,
		extraLibs: []
	});

	return state;
}

export type UseExtraLibsResolverStore = ReturnType<typeof useExtraLibsResolver>;
