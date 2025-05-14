<template>
	<div class="console-viewer-container">
		<ul>
			<li v-for="(value, i) in values" :key="i" :class="[value.type]">
				[{{ value.type.toUpperCase() }}] {{ value.name }}: {{ value.message }}
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import type { ConsoleValue } from "~/types/ConsoleValue";

interface Props {
	values: ConsoleValue[];
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.console-viewer-container {
	padding: 2px;
}

.console-viewer-container > ul {
	list-style-type: none;
	margin: 3px;
	padding: 1px;
}

.console-viewer-container > ul > li:before {
	white-space: pre-wrap;
	content: ">  ";
	color: gray;
	font-weight: bold;
}

.console-viewer-container > ul > li {
	border-bottom: 1px solid #ddd;
	font-size: 13px;
	margin: 3px;
}

.console-viewer-container > ul > li.info {
	color: darkgray;
}

.console-viewer-container > ul > li.warn {
	color: black;
}

.console-viewer-container > ul > li.error {
	color: #f00;
}
</style>
