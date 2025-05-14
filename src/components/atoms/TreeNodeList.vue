<template>
	<ul>
		<li
			v-if="!isRoot"
			class="tree-node-list-label"
			:style="{ paddingLeft: `${(depth ?? 0) * padding}px` }"
			:class="{ active: node.path === props.activePath }"
			@click="handleClicked(node.path)"
		>
			<span v-if="node.children.length">
				<span v-if="state.isOpen" class="material-icons md-18">expand_more</span>
				<span v-else class="material-icons md-18">chevron_right</span>
			</span>
			<slot :node="node"></slot>
		</li>
		<template v-if="node.children.length">
			<TreeNodeList
				v-for="(child, i) in node.children"
				v-show="state.isOpen"
				:key="`${i}`"
				:node="child"
				:onChange="props.onChange"
				:isRoot="false"
				:depth="depth + 1"
				:activePath="props.activePath"
			>
				<template #default="slotProps: { node: TreeNodeItem }">
					<slot :node="slotProps.node"></slot>
				</template>
			</TreeNodeList>
		</template>
	</ul>
</template>

<script lang="ts">
import { reactive } from "vue";
import TreeNodeList from "~/components/atoms/TreeNodeList.vue";
import type { TreeNode } from "~/types/TreeNode";

export interface TreeNodeItem extends TreeNode {
	isOpen?: boolean;
	children: TreeNodeItem[];
}
</script>

<script setup lang="ts">
interface Props {
	isOpen?: boolean;
	isRoot?: boolean;
	activePath?: string;
	padding?: number;
	depth?: number;
	onChange?: (path: string) => void;
	node: TreeNodeItem;
}
interface State {
	isOpen: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	isRoot: true,
	isOpen: true,
	padding: 10,
	depth: 0,
	activePath: undefined,
	onChange: undefined
});
const state = reactive<State>({
	isOpen: props.isOpen
});

const handleClicked = (path: string): void => {
	props.onChange?.(path);
	toggleOpen();
};
const toggleOpen = (): void => {
	state.isOpen = !state.isOpen;
};
</script>

<style lang="scss" scoped>
ul {
	> .tree-node-list-label {
		cursor: pointer;
		display: flex;
		align-items: center;
		font-size: 15px;
		user-select: none;
		white-space: nowrap;

		&:hover {
			background-color: #eee;
		}

		&.active {
			background-color: rgba(14, 10, 10, 0.155);
		}
	}

	.material-icons {
		color: rgb(155, 155, 155);
	}
}
</style>
