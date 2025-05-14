<template>
	<GameCanvas
		ref="gameCanvasRef"
		:width="gameConfs.width"
		:height="gameConfs.height"
		:running="gameContext.running"
		:note="'akashic-engine@' + gameContext.currentVersion"
		:onRun="run"
		:onStop="stop"
		:onReload="reload"
	/>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import GameCanvas, { getCanvasElement } from "~/components/organisms/GameCanvas.vue";
import type { UseGameContextStore } from "~/composables/useGameContext";
import { useGameContextKey } from "~/composables/useGameContext";
import type { UseGameJSONResolverStore } from "~/composables/useGameJSONResolver";
import { useGameJSONResolverKey } from "~/composables/useGameJSONResolver";

const gameConfs = inject(useGameJSONResolverKey) as UseGameJSONResolverStore;
const gameContext = inject(useGameContextKey) as UseGameContextStore;
const gameCanvasRef = ref<InstanceType<typeof GameCanvas>>();

onMounted(() => {
	const canvas = getCanvasElement();
	gameContext.setCanvas(canvas);
});

const run = (): void => {
	// TODO: 重複ロジック
	const gameJSON = gameConfs.pseudoFiles.find(({ assetType }) => assetType === "game.json");
	gameContext.run(
		gameConfs.generateGameJSON(gameJSON && gameJSON.editorType === "text" ? JSON.parse(gameJSON.value) : undefined),
		gameConfs.pseudoFiles,
		gameConfs.assetBase
	);
};

const stop = (): void => {
	gameContext.stop();
};

const reload = (): void => {
	run();
};
</script>

<style lang="scss" scoped>
.game-canvas-container {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	min-width: 320px;
	min-height: 320px;
}

.game-canvas-container > .fixed {
	position: absolute;
	top: 3px;
	right: 3px;
}

.container-agv-canvas-overlay {
	position: absolute;
	width: 100%;
	height: 100%;
}

.container-agv-canvas-overlay > span {
	font-size: 50px;
}

.container-agv-canvas-overlay .pointer:hover {
	color: #666;
}

.container-agv-canvas-overlay > .center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
}

.container-agv-canvas-overlay > .corner {
	display: flex;
	flex-direction: column;
	justify-content: right;
	align-items: flex-end;
	width: 100%;
	height: 100%;
}
</style>
