<!-- Playground のページ -->

<template>
	<div class="playground-page-container">
		<div class="container-header">
			<div class="logo">Akashic Playground</div>
		</div>
		<div ref="containerBodyRef" class="container-body">
			<div class="container-editor" :style="isLargeScreen ? { width: leftPaneWidth } : {}">
				<AkashicEditor :pseudoFiles="gameConfs.pseudoFiles" />
			</div>
			<div class="resizer" @mousedown="handleStartResize"></div>
			<div class="container-agv hidden-scrollbar" :style="isLargeScreen ? { width: rightPaneWidth } : {}">
				<GameController />
			</div>
		</div>
		<div v-if="props.showDownloadButton" class="container-download">
			<DownloadButton :pseudoFiles="gameConfs.pseudoFiles" :name="props.name + '.' + Date.now()" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { provide, ref, computed, onMounted, onUnmounted } from "vue";

import DownloadButton from "~/components/molecules/DownloadButton.vue";
import AkashicEditor from "~/components/templates/AkashicEditor.vue";
import GameController from "~/components/templates/GameController.vue";
import { useGameContext, useGameContextKey } from "~/composables/useGameContext";
import { useGameJSONResolver, useGameJSONResolverKey } from "~/composables/useGameJSONResolver";

interface Props {
	gameJsonUri: string;
	name: string;
	showDownloadButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	showDownloadButton: true
});

const gameConfs = useGameJSONResolver();
provide(useGameJSONResolverKey, gameConfs);
provide(useGameContextKey, useGameContext());
// FIXME: await を付けた場合、実行時にページが真っ白で表示されなくなる。
gameConfs.fetchPseudoFilesFromUri(props.gameJsonUri).catch(e => console.error(e));

// 左右リサイズ機能
const breakpoint = 960;
const containerBodyRef = ref<HTMLElement | null>(null);
const leftPaneWidthPercent = ref(60);
const isResizing = ref(false);
const isLargeScreen = ref(true);

const leftPaneWidth = computed(() => `${leftPaneWidthPercent.value}%`);
const rightPaneWidth = computed(() => `${100 - leftPaneWidthPercent.value}%`);

const handleWindowResize = () => {
	isLargeScreen.value = window.matchMedia(`(min-width: ${breakpoint}px)`).matches;
};

const handleStartResize = (e: MouseEvent) => {
	isResizing.value = true;
	e.preventDefault();
};

const handleMouseMove = (e: MouseEvent) => {
	if (!isResizing.value) return;
	if (!containerBodyRef.value) return;

	const containerRect = containerBodyRef.value.getBoundingClientRect();
	const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

	// 最小幅 20% 最大幅 80% に制限
	if (newLeftWidth >= 20 && newLeftWidth <= 80) {
		leftPaneWidthPercent.value = newLeftWidth;
	}
};

const handleMouseUp = () => {
	isResizing.value = false;
};

onMounted(() => {
	handleWindowResize();
	window.addEventListener("resize", handleWindowResize);
	document.addEventListener("mousemove", handleMouseMove);
	document.addEventListener("mouseup", handleMouseUp);
});

onUnmounted(() => {
	window.removeEventListener("resize", handleWindowResize);
	document.removeEventListener("mousemove", handleMouseMove);
	document.removeEventListener("mouseup", handleMouseUp);
});
</script>

<style lang="scss" scoped>
@include media-breakpoint-up(lg) {
	.playground-page-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.container-header {
		height: 45px;
	}

	.container-header > div.logo {
		font-size: 24px;
		font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
		font-weight: bold;
		color: #ce5e5e;
	}

	.container-body {
		width: 100%;
		height: calc(100% - 45px);
		display: flex;
		flex-direction: row;
	}

	.container-editor {
		height: 100%;
		display: flex;
		flex-direction: row;
		overflow: hidden;
	}

	.resizer {
		width: 4px;
		background-color: #ccc;
		cursor: col-resize;
		flex-shrink: 0;
		transition: background-color 0.2s;
		user-select: none;

		&:hover {
			background-color: #999;
		}

		&:active {
			background-color: #666;
		}
	}

	.container-agv {
		height: 100%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		overflow: scroll;
	}

	.container-download {
		position: fixed;
		bottom: 3px;
		right: 3px;
		color: whitesmoke;
		z-index: 1;
	}
}

@include media-breakpoint-down(lg) {
	.playground-page-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.container-header {
		height: 45px;
	}

	.container-header > div.logo {
		font-size: 24px;
		font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
		font-weight: bold;
		color: #ce5e5e;
	}

	.container-body {
		width: 100%;
		height: calc(100% - 45px);
		display: flex;
		flex-direction: column-reverse;
	}

	.container-editor {
		width: 100%;
		height: 100%;
		overflow: scroll;
		display: flex;
		flex-direction: row;
		position: relative;
	}

	.resizer {
		display: none;
	}

	.container-agv {
		margin: 0 auto;
		display: flex;
		justify-content: center;
		overflow: visible;
		flex-direction: row;
		position: relative;
		background-color: white;
	}

	.container-download {
		position: fixed;
		bottom: 3px;
		right: 3px;
		color: whitesmoke;
	}
}
</style>
