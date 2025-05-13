<template>
	<div class="akashic-editor-container">
		<div class="container-top">
			<div class="container-tabs hidden-scrollbar">
				<AssetListViewer
					:pseudoFiles="gameConfs.pseudoFiles"
					:currentPseudoFile="state.currentPseudoFile"
					:onCurrentPseudoFileChange="handleCurrentPseudoFileChanged"
				></AssetListViewer>
			</div>
			<div class="editor">
				<div v-show="state.currentPseudoFile && state.currentPseudoFile.editorType === 'text'">
					<CodeEditor ref="CodeEditorRef" :handleValueChanged="state.handleEditorValueChanged" />
				</div>
				<div v-if="state.currentPseudoFile && state.currentPseudoFile.editorType === 'image'">
					<ImageViewer
						:width="state.currentPseudoFile.width"
						:height="state.currentPseudoFile.height"
						:src="state.currentPseudoFile.uri"
						:title="state.currentPseudoFile.name"
					/>
				</div>
				<div v-else-if="state.currentPseudoFile && state.currentPseudoFile.editorType === 'audio'">
					<AudioPlayer
						:src="state.currentPseudoFile.uri"
						:title="state.currentPseudoFile.name"
						:extensions="state.currentPseudoFile.hint.extensions"
					/>
				</div>
				<div v-else-if="state.currentPseudoFile && state.currentPseudoFile.editorType === 'binary'">
					<BinaryViewer :src="state.currentPseudoFile.uri" :title="state.currentPseudoFile.name" />
				</div>
			</div>
		</div>
		<div class="container-bottom">
			<ConsoleViewer :values="gameContext.consoleValues" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject, reactive, watch, provide } from "vue";
import AssetListViewer from "~/components/molecules/AssetListViewer.vue";
import AudioPlayer from "~/components/molecules/AudioPlayer.vue";
import BinaryViewer from "~/components/molecules/BinaryViewer.vue";
import ConsoleViewer from "~/components/molecules/ConsoleViewer.vue";
import ImageViewer from "~/components/molecules/ImageViewer.vue";
import CodeEditor from "~/components/organisms/CodeEditor.vue";
import { useCodeEditor, useCodeEditorKey } from "~/composables/useCodeEditor";
import { useExtraLibsResolver } from "~/composables/useExtraLibsResolver";
import type { UseGameContextStore } from "~/composables/useGameContext";
import { useGameContextKey } from "~/composables/useGameContext";
import type { UseGameJSONResolverStore } from "~/composables/useGameJSONResolver";
import { useGameJSONResolverKey } from "~/composables/useGameJSONResolver";
import type { PseudoFile } from "~/types/PseudoFile";

interface State {
	currentPseudoFile: PseudoFile | null;
	handleEditorValueChanged?: (value: string) => void;
}

const state = reactive<State>({
	currentPseudoFile: null,
	handleEditorValueChanged: undefined
});

const editorState = useCodeEditor();
const gameContext = inject(useGameContextKey) as UseGameContextStore;
const gameConfs = inject(useGameJSONResolverKey) as UseGameJSONResolverStore;
provide(useCodeEditorKey, editorState);

gameContext.handleErrors(window);

watch(
	() => gameConfs.dependencies,
	async dependencies => {
		if (!dependencies.length) return;
		const extLibsResolver = useExtraLibsResolver();
		const uris = extLibsResolver.getExtraLibUris(gameContext.currentVersion, dependencies);
		extLibsResolver.fetchExtraLibsFromUris(uris).catch(e => console.log(e));
		watch(
			() => extLibsResolver.extraLibs,
			extraLibs => {
				editorState.setExtraLibs(extraLibs);
			},
			{
				deep: true
			}
		);
	},
	{
		deep: true
	}
);

watch(
	() => gameConfs.entryAssetUri,
	() => {
		handleCurrentPseudoFileChanged(gameConfs.entryAssetUri);
	}
);

const handleCurrentPseudoFileChanged = (uri: string | null): void => {
	const file = gameConfs.pseudoFiles.find(f => f.uri === uri);
	if (!file) return;
	if (file.editorType === "text") {
		editorState.setValue(file.uri, file.value, file.language);
		state.handleEditorValueChanged = (value: string) => {
			file.value = value;
		};
	} else {
		state.handleEditorValueChanged = undefined;
	}
	state.currentPseudoFile = file;
};
</script>

<style lang="scss" scoped>
@include media-breakpoint-up(lg) {
	.akashic-editor-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.container-top {
		width: 100%;
		height: calc(100% - 50px);
		display: flex;
		flex-direction: row;
	}

	.container-top > div.editor,
	.container-top > div.editor > div {
		width: 100%;
		height: 100%;
	}

	.container-tabs {
		min-width: 180px;
		max-width: 240px;
		border-right: 2px solid #ddd;
		overflow-y: scroll;
	}

	.container-bottom {
		height: 50px;
		overflow-y: scroll;
	}
}

@include media-breakpoint-down(lg) {
	.akashic-editor-container {
		width: 100%;
		height: calc(100% - 50px);
	}

	.container-top > div.editor {
		width: 100%;
		height: calc(100% - 50px);
	}

	.container-top > div.editor > div {
		width: 100%;
		height: 100%;
	}

	.container-top {
		height: 100%;
		overflow: hidden;
	}

	.container-tabs {
		width: 100%;
		border-top: 2px solid #ddd;
		overflow-x: scroll;
	}

	.container-bottom {
		height: 50px;
		overflow-y: scroll;
	}
}
</style>
