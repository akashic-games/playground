import type { InjectionKey } from "vue";
import { reactive } from "vue";

export const useCodeEditorKey: InjectionKey<UseCodeEditorStore> = Symbol("useCodeEditor");

interface State {
	uri: string;
	value: string;
	language: string;
	extraLibs: { content: string; filePath?: string }[];
	setValue: (uri: string, value: string, language: string) => void;
	setExtraLibs: (extraLibs: { content: string; filePath?: string }[]) => void;
}

export function useCodeEditor(): State {
	const setValue = (uri: string, value: string, language: string): void => {
		state.uri = uri;
		state.value = value;
		state.language = language;
	};

	const setExtraLibs = (extraLibs: { content: string; filePath?: string }[]): void => {
		state.extraLibs = extraLibs;
	};

	const state = reactive<State>({
		uri: "",
		value: "",
		language: "text",
		extraLibs: [],
		setValue,
		setExtraLibs
	});

	return state;
}

export type UseCodeEditorStore = ReturnType<typeof useCodeEditor>;
