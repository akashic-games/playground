<template>
	<MediaQuerySelector :breakpoint="breakpoint">
		<template #sp>
			<ul>
				<li
					v-for="(asset, i) in pseudoFiles"
					:key="i"
					:class="{
						active: currentPseudoFile && currentPseudoFile.uri === pseudoFiles[i].uri,
						hidden: pseudoFiles[i].hidden
					}"
					:title="pseudoFiles[i].name"
					@click="handleCurrentPseudoFileChanged(pseudoFiles[i].path)"
				>
					<span v-if="pseudoFiles[i].assetType === 'game.json'"
						><i class="material-icons inline" style="color: #eb8b35">settings</i></span
					>
					<span v-else-if="pseudoFiles[i].editorType === 'text'"
						><i class="material-icons inline" style="color: #090c10">text_snippet</i></span
					>
					<span v-else-if="pseudoFiles[i].editorType === 'image'"
						><i class="material-icons inline" style="color: #e50185">image</i></span
					>
					<span v-else-if="pseudoFiles[i].editorType === 'audio'"
						><i class="material-icons inline" style="color: #084f93">music_note</i></span
					>
					<span v-else-if="pseudoFiles[i].editorType === 'binary'"
						><i class="material-icons inline" style="color: #089379">note</i></span
					>
					<span v-else><i class="material-icons inline" style="color: #d71414">question_mark</i></span>
					{{ asset.filename }}
				</li>
			</ul>
		</template>
		<template #pc>
			<TreeNodeList
				:node="state.node"
				:isOpen="true"
				:activePath="state.currentPseudoFile?.path"
				:onChange="handleCurrentPseudoFileChanged"
				class="asset-list-container"
			>
				<template #default="slotProps">
					<span class="asset-list">
						<span v-if="getPseudoFileByPath(slotProps.node.path)?.assetType === 'game.json'"
							><i class="material-icons md-18 inline" style="color: #eb8b35">settings</i></span
						>
						<span v-else-if="getPseudoFileByPath(slotProps.node.path)?.editorType === 'text'"
							><i class="material-icons md-18 inline" style="color: #090c10">text_snippet</i></span
						>
						<span v-else-if="getPseudoFileByPath(slotProps.node.path)?.editorType === 'image'"
							><i class="material-icons md-18 inline" style="color: #e50185">image</i></span
						>
						<span v-else-if="getPseudoFileByPath(slotProps.node.path)?.editorType === 'audio'"
							><i class="material-icons md-18 inline" style="color: #084f93">music_note</i></span
						>
						<span v-else-if="getPseudoFileByPath(slotProps.node.path)?.editorType === 'binary'"
							><i class="material-icons md-18 inline" style="color: #089379">note</i></span
						>
						<span v-else-if="!slotProps.node.isDirectory"
							><i class="material-icons md-18 inline" style="color: #d71414">question_mark</i></span
						>
						{{ slotProps.node.label }}
					</span>
				</template>
			</TreeNodeList>
		</template>
	</MediaQuerySelector>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import type { TreeNodeItem } from "~/components/atoms/TreeNodeList.vue";
import TreeNodeList from "~/components/atoms/TreeNodeList.vue";
import MediaQuerySelector from "~/components/molecules/MediaQuerySelector.vue";
import type { PseudoFile } from "~/types/PseudoFile";
import type { TreeNode } from "~/types/TreeNode";
import { buildTreeNode, compareNodes } from "~/utils/buildTreeNode";

interface Props {
	pseudoFiles: PseudoFile[];
	currentPseudoFile: PseudoFile | null;
	onCurrentPseudoFileChange: (uri: string | null) => void;
}
interface State {
	currentPseudoFile: PseudoFile | null;
	node: TreeNodeItem;
}

const props = defineProps<Props>();
const state = reactive<State>({
	currentPseudoFile: props.currentPseudoFile,
	node: {
		path: "",
		label: "",
		isOpen: true,
		isDirectory: true,
		children: []
	}
});

// FIXME: ハードコーディングやめる
const breakpoint = 960;

const getPseudoFileByPath = (path: string): PseudoFile | undefined => {
	return props.pseudoFiles.find(pseudoFile => pseudoFile.path === path);
};

const handleCurrentPseudoFileChanged = (path: string): void => {
	const file = getPseudoFileByPath(path);
	props.onCurrentPseudoFileChange(file?.uri ?? null);
};

const compareFunc = (a: TreeNode, b: TreeNode): number => {
	// game.json は先頭に持ってくる
	if (a.path === "game.json") {
		return -1;
	}
	if (b.path === "game.json") {
		return 1;
	}
	// node_modules は末尾に持っていく
	if (a.path === "node_modules") {
		return 1;
	}
	if (b.path === "node_modules") {
		return -1;
	}
	// そうでなければデフォルト
	return compareNodes(a, b);
};

watch(
	() => props.currentPseudoFile,
	currentPseudoFile => {
		state.currentPseudoFile = currentPseudoFile;
	}
);

watch(
	() => props.pseudoFiles,
	pseudoFiles => {
		const node = buildTreeNode(pseudoFiles, "path", compareFunc);
		state.node = node;
	},
	{
		deep: true
	}
);
</script>

<style lang="scss" scoped>
@include media-breakpoint-up(lg) {
	.asset-list-container {
		padding: 3px 5px;

		.asset-list {
			padding: 3px;
		}
	}
}

@include media-breakpoint-down(lg) {
	ul {
		list-style-type: none;
		margin: 5px;
		padding: 5px 5px 0 5px;
		display: flex;
		flex-direction: row;

		> li {
			cursor: pointer;
			padding: 8px;
			margin: 0px 3px;
			border-color: #666;
			border-style: solid;
			border-width: 1px 1px 0 1px;
			border-top-left-radius: 6px;
			border-top-right-radius: 6px;
			font-size: 14px;
			white-space: nowrap;
			background-color: #eee;

			&:hover {
				background-color: #ddd;
			}

			&.active {
				background-color: #fff;
			}

			&.hidden {
				color: #aaa;
				display: none;
			}
		}
	}
}
</style>
