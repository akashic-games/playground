<template>
	<div ref="editorRef" class="container-code-editor"></div>
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { inject, onMounted, onUnmounted, ref, watch } from "vue";
import type { UseCodeEditorStore } from "~/composables/useCodeEditor";
import { useCodeEditorKey } from "~/composables/useCodeEditor";

interface Props {
	handleValueChanged?: (value: string) => void;
}

const props = defineProps<Props>();
const editorRef = ref<HTMLDivElement>();
const editorState = inject<UseCodeEditorStore>(useCodeEditorKey)!; // FIXME: `!` の削除

let editor: monaco.editor.IStandaloneCodeEditor | null = null;

watch(
	() => editorState.extraLibs,
	extraLibs => {
		monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
			allowNonTsExtensions: true
		});
		monaco.languages.typescript.javascriptDefaults.setExtraLibs(extraLibs);
	},
	{
		deep: true
	}
);

watch(
	() => [editorState.uri, editorState.value, editorState.language],
	([uri, value, language]) => {
		if (!editor) return;
		const mUri = monaco.Uri.parse(uri);
		let model = monaco.editor.getModel(mUri);
		if (!model) {
			model = monaco.editor.createModel(value, language, mUri);
			model.updateOptions({
				tabSize: 2,
				trimAutoWhitespace: true
			});
		}
		editor.setModel(model);
	},
	{
		deep: true
	}
);

onMounted(() => {
	const elm = editorRef.value!;
	editor = monaco.editor.create(elm, {
		automaticLayout: true,
		scrollBeyondLastLine: false,
		scrollbar: {
			alwaysConsumeMouseWheel: false
		},
		minimap: {
			enabled: false
		}
	});
	editor.onDidChangeModelContent(e => {
		if (!editor) return;
		const model = editor.getModel();
		if (!model) return;
		const value = editor.getValue();
		if (props.handleValueChanged) {
			props.handleValueChanged(value);
		}
	});
});

onUnmounted(() => {
	if (editor) editor.dispose();
});
</script>

<style lang="scss" scoped>
.container-code-editor {
	width: 100%;
	height: 100%;
}
</style>
