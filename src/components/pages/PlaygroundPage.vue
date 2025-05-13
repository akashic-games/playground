<!-- Playground のページ -->

<template>
	<div class="playground-page-container">
		<div class="container-header">
			<div class="logo">Akashic Playground</div>
		</div>
		<div class="container-body">
			<div class="container-editor">
				<AkashicEditor :pseudoFiles="gameConfs.pseudoFiles" />
			</div>
			<div class="container-agv hidden-scrollbar">
				<GameController />
			</div>
		</div>
		<div v-if="props.showDownloadButton" class="container-download">
			<DownloadButton :pseudoFiles="gameConfs.pseudoFiles" :name="props.name + '.' + Date.now()" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { provide } from "vue";

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
gameConfs.fetchPseudoFilesFromUri(props.gameJsonUri).catch(e => console.log(e));
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
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		overflow: hidden;
	}

	.container-agv {
		width: 100%;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
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
		flex-direction: row;
		flex-direction: column;
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

	.container-agv {
		margin: 0 auto;
		display: flex;
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
