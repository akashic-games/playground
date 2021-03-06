<!-- public/samples に置かれたサンプルを表示するページ -->

<template>
	<div class="sample-page-container">
		<div class="container-agv">
			<div class="container-agv-canvas">
				<GameController />
			</div>
			<div v-if="state.title || state.description" class="container-agv-meta">
				<h1>{{ state.title }}</h1>
				<div class="container-agv-meta-description">
					<!-- eslint-disable-next-line vue/no-v-html markdownのみのサポートのため許可 -->
					<span v-html="state.description"></span>
				</div>
			</div>
		</div>
		<div class="container-editor hidden-scrollbar">
			<AkashicEditor :pseudoFiles="gameConfs.pseudoFiles" />
		</div>
		<div class="container-download">
			<DownloadButton :pseudoFiles="gameConfs.pseudoFiles" :name="props.name + '.' + Date.now()" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, provide, reactive, watch } from "@vue/composition-api";
import DownloadButton from "~/components/molecules/DownloadButton.vue";
import AkashicEditor from "~/components/templates/AkashicEditor.vue";
import GameController from "~/components/templates/GameController.vue";
import { useGameContext, useGameContextKey, UseGameContextStore } from "~/composables/useGameContext";
import { useGameJSONResolver, useGameJSONResolverKey, UseGameJSONResolverStore } from "~/composables/useGameJSONResolver";

const marked = require("marked");
const renderer = new marked.Renderer();
renderer.link = function (href: string, title: string, text: string) {
	const link = marked.Renderer.prototype.link.call(this, href, title, text);
	return link.replace("<a ", "<a target='_blank' ref='noopener'");
};

marked.setOptions({
	renderer
});

export interface State {
	title: string | null;
	description: string | null;
	processingAsZip: boolean;
}

export default defineComponent({
	components: {
		DownloadButton,
		AkashicEditor,
		GameController
	},
	props: {
		gameJsonUri: {
			type: String,
			required: true
		},
		autoplay: {
			type: Boolean,
			default: false
		},
		name: {
			type: String,
			required: true
		}
	},
	setup(props) {
		provide(useGameJSONResolverKey, useGameJSONResolver());
		provide(useGameContextKey, useGameContext());
		const gameConfs = inject(useGameJSONResolverKey) as UseGameJSONResolverStore;
		const gameContext = inject(useGameContextKey) as UseGameContextStore;

		gameConfs.fetchPseudoFilesFromUri(props.gameJsonUri);

		const state = reactive<State>({
			title: null,
			description: null,
			processingAsZip: false
		});

		watch(
			() => [gameConfs.title, gameConfs.description],
			([title, description]) => {
				state.title = title ?? null;
				state.description = description ? marked(description) : null;
			}
		);

		watch(
			() => gameConfs.pseudoFiles,
			() => {
				if (props.autoplay) {
					// TODO: 重複ロジック
					const gameJSON = gameConfs.pseudoFiles.find(({ assetType }) => assetType === "game.json");
					gameContext.run(
						gameConfs.generateGameJSON(gameJSON && gameJSON.editorType === "text" ? JSON.parse(gameJSON.value) : undefined),
						gameConfs.pseudoFiles,
						gameConfs.assetBase
					);
					// 重複ロジックここまで
				}
			}
		);

		return {
			props,
			state,
			gameConfs
		};
	}
});
</script>

<style scoped>
@media screen and (min-width: 960px) {
	.sample-page-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.container-agv {
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
	}

	.container-agv-meta {
		margin: 10px 0;
		padding: 10px;
		min-width: 500px;
		max-width: 600px;
	}

	.container-agv-meta > h1 {
		font-size: 24px;
		line-height: 28px;
		border-bottom: solid 2px #6f7f86;
		padding-bottom: 4px;
	}

	.container-agv-meta-description {
		padding: 7px;
		line-height: 1.4;
	}

	.container-editor {
		width: 100%;
		height: 100%;
		overflow: scroll;
		display: flex;
		flex-direction: row;
		position: relative;
		background-color: white;
		border-top: 3px double #333;
	}

	.container-download {
		position: fixed;
		bottom: 3px;
		right: 3px;
		color: whitesmoke;
	}
}

@media screen and (max-width: 959px) {
	.sample-page-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.container-agv {
		width: 100%;
		flex-direction: column;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
	}

	.container-agv-meta {
		margin: 10px 0;
		padding: 10px;
		width: 100%;
	}

	.container-agv-meta > h1 {
		font-size: 24px;
		line-height: 28px;
		border-bottom: solid 2px #6f7f86;
		padding-bottom: 4px;
	}

	.container-agv-meta-description {
		padding: 7px;
		line-height: 1.4;
	}

	.container-editor {
		width: 100%;
		height: 100%;
		overflow: scroll;
		display: flex;
		flex-direction: row;
		position: relative;
		background-color: white;
		border-top: 3px double #333;
	}

	.container-download {
		position: fixed;
		bottom: 3px;
		right: 3px;
		color: whitesmoke;
	}
}
</style>
