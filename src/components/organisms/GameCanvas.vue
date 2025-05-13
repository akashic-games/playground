<template>
	<div class="container-game-canvas">
		<div v-if="!props.running" class="container-game-canvas-overlay">
			<div class="center">
				<i title="Run" class="material-icons pointer md-120" @click="props.onRun">play_arrow</i>
			</div>
		</div>
		<div v-else class="container-game-canvas-ctrl pointer">
			<div title="Reload" class="button" @click="props.onReload"><i class="material-icons md-18">refresh</i></div>
			<div title="Stop" class="button" @click="props.onStop"><i class="material-icons md-18">stop</i></div>
		</div>
		<div class="container-game-canvas-note">
			{{ props.note }}
		</div>
		<div ref="scalableRef">
			<canvas ref="canvasRef" class="game-canvas transparent" :width="props.width" :height="props.height"></canvas>
		</div>
	</div>
</template>

<script lang="ts">
const canvasRef = ref<HTMLCanvasElement>();
export const getCanvasElement = (): HTMLCanvasElement | null => {
	const canvas = canvasRef.value ?? null;
	return canvas;
};
</script>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";

interface Props {
	width: number;
	height: number;
	running: boolean;
	note?: string;
	onRun: () => void;
	onStop: () => void;
	onReload: () => void;
}

const props = defineProps<Props>();
const scalableRef = ref<HTMLDivElement>();

const adjust = (): void => {
	if (!scalableRef.value) return;
	const elem = window.document.body;
	const dom = scalableRef.value;
	const scale = Math.min(1, Math.min(elem.clientWidth / props.width, elem.clientHeight / props.height));
	dom.style.transformOrigin = `0 0`;
	dom.style.transform = `scale(${scale})`;
	dom.style.width = props.width * scale + "px";
	dom.style.height = props.height * scale + "px";
};

watch(
	() => [props.width, props.height],
	() => {
		adjust();
	},
	{
		deep: true
	}
);

onMounted(() => {
	window.addEventListener("resize", adjust);
});

onUnmounted(() => {
	window.removeEventListener("resize", adjust);
});
</script>

<style lang="scss" scoped>
.container-game-canvas {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
}

.container-game-canvas-ctrl {
	position: absolute;
	display: flex;
	flex-direction: row;
	z-index: 1;
	top: 3px;
	right: 3px;
}

.container-game-canvas-ctrl > .button {
	border-radius: 10%;
	background-color: white;
	width: 20px;
	height: 20px;
	margin: 3px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.container-game-canvas-ctrl > .button {
	opacity: 0.4;
}

.container-game-canvas-ctrl > .button:hover {
	opacity: 1;
}

.container-game-canvas-note {
	position: absolute;
	display: flex;
	flex-direction: row;
	z-index: 1;
	bottom: 3px;
	right: 3px;
	color: #666;
	font-size: 13px;
	pointer-events: none;
}

.container-game-canvas-overlay {
	position: absolute;
	width: 100%;
	height: 100%;
	max-width: inherit;
	max-height: inherit;
	padding: 5%;
	z-index: 1;
}

.container-game-canvas-overlay > span {
	font-size: 70px;
}

.container-game-canvas-overlay .pointer:hover {
	opacity: 0.6;
}

.container-game-canvas-overlay > .center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
}

.container-game-canvas-overlay > .corner {
	display: flex;
	flex-direction: column;
	justify-content: right;
	align-items: flex-end;
	width: 100%;
	height: 100%;
}

.game-canvas {
	touch-action: none;
}
</style>
