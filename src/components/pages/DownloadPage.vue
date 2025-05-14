<template>
	<div>
		<div class="message">
			<p>Trying to download the game.</p>
			<p v-if="autoStartDownload">If the download doesn't start automatically, please click the following:</p>
			<p v-else>To start the download, please click the following:</p>
		</div>
		<div class="button">
			<p>
				<BaseButton :on-click="download"> Download </BaseButton>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, provide } from "vue";
import BaseButton from "~/components/atoms/BaseButton.vue";
import { useGameContext, useGameContextKey } from "~/composables/useGameContext";
import { useGameJSONResolver, useGameJSONResolverKey } from "~/composables/useGameJSONResolver";
import { downloadAsZip } from "~/utils/downloadAsZip";

interface Props {
	gameJsonUri: string;
	name: string;
	autoStartDownload?: boolean;
	autoCloseWindow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	autoStartDownload: true,
	autoCloseWindow: false
});

const gameConfs = useGameJSONResolver();
provide(useGameJSONResolverKey, gameConfs);
provide(useGameContextKey, useGameContext());

const download = async (): Promise<void> => {
	await downloadAsZip(props.name, gameConfs.pseudoFiles);
};

onMounted(async () => {
	await gameConfs.fetchPseudoFilesFromUri(props.gameJsonUri);
	if (props.autoStartDownload) {
		await download();

		// NOTE: 自動ダウンロード時のみ対応
		if (props.autoCloseWindow) {
			window.close();
		}
	}
});
</script>

<style lang="scss" scoped>
div {
	padding: 10px;
	text-align: center;
	display: flex;
	flex-direction: column;
	line-height: 1.8;

	.button {
		> p {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}
}
</style>
