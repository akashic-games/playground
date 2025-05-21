<!-- iframe 上で動かす想定のスニペットのページ -->

<template>
	<div class="snippet-page-container">
		<div v-if="!state.ready" class="container-overlay pointer" @click="handleClickOverlay">
			<span class="text">コードを実行</span>
			<span class="icon"><i class="material-icons md-120">play_arrow</i></span>
		</div>
		<div v-if="props.showTab" class="container-page-tab">
			<ul>
				<li class="page-tab" :class="{ active: state.currentPageTabName === 'code' }">
					<a @click="changeCurrentPageTab('code')">CODE</a>
				</li>
				<li class="page-tab" :class="{ active: state.currentPageTabName === 'game' }">
					<a @click="changeCurrentPageTab('game')">GAME</a>
				</li>
			</ul>
		</div>
		<div v-show="state.currentPageTabName === 'game'" class="container-agv">
			<GameController ref="gameContollerRef" />
		</div>
		<div v-show="state.currentPageTabName === 'code'" class="container-editor">
			<AkashicEditor :pseudoFiles="gameConfs.pseudoFiles" />
		</div>
		<div v-if="props.showDownloadButton" class="container-download">
			<DownloadButton :pseudoFiles="gameConfs.pseudoFiles" :name="props.name + '.' + Date.now()" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { provide, reactive } from "vue";
import DownloadButton from "~/components/molecules/DownloadButton.vue";
import AkashicEditor from "~/components/templates/AkashicEditor.vue";
import GameController from "~/components/templates/GameController.vue";
import { useGameContext, useGameContextKey } from "~/composables/useGameContext";
import { useGameJSONResolver, useGameJSONResolverKey } from "~/composables/useGameJSONResolver";

interface Props {
	gameJsonUri: string;
	name: string;
	autoplay?: boolean;
	showDownloadButton?: boolean;
	showTab?: boolean;
}

interface State {
	currentPageTabName: string;
	ready: boolean;
	processingAsZip: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	autoplay: false,
	showDownloadButton: true,
	showTab: true
});

const gameConfs = useGameJSONResolver();
const gameContext = useGameContext();
provide(useGameJSONResolverKey, gameConfs);
provide(useGameContextKey, gameContext);

const state = reactive<State>({
	currentPageTabName: "code",
	ready: props.autoplay,
	processingAsZip: false
});

const handleClickOverlay = async (): Promise<void> => {
	await gameConfs.fetchPseudoFilesFromUri(props.gameJsonUri);
	// TODO: 重複ロジック
	const gameJSON = gameConfs.pseudoFiles.find(({ assetType }) => assetType === "game.json");
	gameContext.run(
		gameConfs.generateGameJSON(gameJSON && gameJSON.editorType === "text" ? JSON.parse(gameJSON.value) : undefined),
		gameConfs.pseudoFiles,
		gameConfs.assetBase
	);
	// 重複ロジックここまで
	state.currentPageTabName = "game";
	state.ready = true;
};

const changeCurrentPageTab = (name: string): void => {
	state.currentPageTabName = name;
};

if (props.autoplay) {
	// FIXME: await を付けた場合、実行時にページが真っ白で表示されなくなる。
	handleClickOverlay().catch(e => console.error(e));
}
</script>

<style lang="scss" scoped>
.snippet-page-container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	position: relative;
	overflow: hidden;
}

.container-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgb(77, 77, 77);
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: whitesmoke;
	font-size: 30px;
}

.container-overlay:hover {
	color: lightgray;
}

.container-page-tab {
	width: 100%;
	height: 43px;
	border-bottom: 3px solid #333;
}

.container-page-tab > ul {
	list-style: none;
	display: flex;
}

.container-page-tab > ul > li {
	width: 100px;
	text-align: center;
	margin-right: 2px;
	cursor: pointer;
}

.container-page-tab > ul > li.active {
	background-color: #333;
	color: #fff;
	font-weight: bold;
}

.container-page-tab > ul > li:hover {
	background-color: #ddd;
	color: inherit !important;
}

.container-page-tab > ul > li > a {
	padding: 10px;
	text-decoration: none;
	line-height: 40px;
}

.container-agv {
	margin: 0 auto;
	display: flex;
	flex-direction: row;
}

.container-agv-canvas {
	position: relative;
}

.container-editor {
	width: 100%;
	height: calc(100% - 43px);
	display: flex;
	flex-direction: row;
	position: relative;
}

.container-download {
	position: fixed;
	bottom: 3px;
	right: 3px;
}
</style>
