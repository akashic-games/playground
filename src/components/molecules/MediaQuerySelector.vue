<template>
	<template v-if="isPC">
		<slot name="pc"></slot>
	</template>
	<template v-else>
		<slot name="sp"></slot>
	</template>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

interface Props {
	breakpoint: number;
}
const props = defineProps<Props>();

const mediaQuery = window.matchMedia(`(min-width: ${props.breakpoint - 1}px)`);
const isPC = ref(props.breakpoint <= window.innerWidth);

const handleMediaQueryChanged = (): void => {
	isPC.value = props.breakpoint <= window.innerWidth;
};

onMounted(() => {
	mediaQuery.addEventListener("change", handleMediaQueryChanged);
});

onUnmounted(() => {
	mediaQuery.removeEventListener("change", handleMediaQueryChanged);
});
</script>
