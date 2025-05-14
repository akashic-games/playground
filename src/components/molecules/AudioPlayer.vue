<template>
	<div ref="audioContainerRef" class="audio-container"></div>
</template>

<script setup lang="ts">
import urlJoin from "url-join";
import { onMounted, ref, watch } from "vue";
import { getMimeType } from "~/utils/getMimeType";
import { basename, dirname } from "~/utils/path";

interface Props {
	title: string;
	src: string;
	extensions: string[]; // [".xxx", ".yyy"] の形式
}

const props = defineProps<Props>();
const audioContainerRef = ref<HTMLAudioElement>();

const createPlayer = (): void => {
	if (!audioContainerRef.value) return;
	audioContainerRef.value.innerHTML = "";
	const player = document.createElement("audio");
	player.setAttribute("controls", "");

	for (const extension of props.extensions) {
		const src = document.createElement("source");
		src.setAttribute("src", urlJoin(dirname(props.src), basename(props.src) + extension));
		src.setAttribute("type", getMimeType(extension));
		player.appendChild(src);
	}

	audioContainerRef.value.appendChild(player);
};

onMounted(() => {
	createPlayer();
});

watch(
	() => props.src,
	() => {
		createPlayer();
	}
);
</script>

<style lang="scss" scoped>
.audio-container {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
