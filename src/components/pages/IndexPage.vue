<template>
	<div>
		<h2>Playground</h2>
		<ul>
			<li><router-link :to="{ name: 'edit', params: { name: 'default' } }">Playground (default)</router-link></li>
			<li><router-link :to="{ name: 'edit', params: { name: 'timeline' } }">Playground (timeline)</router-link></li>
			<li><router-link :to="{ name: 'edit', params: { name: 'label' } }">Playground (label)</router-link></li>
			<li>
				<router-link :to="{ name: 'edit', params: { name: 'box2d' }, query: { nodl: null } }"
					>Playground (box2d, DLボタン非表示)</router-link
				>
			</li>
		</ul>
		<h2>Sample</h2>
		<ul>
			<li>
				<router-link
					:to="{
						name: 'sample',
						params: {
							base64_uri_params: encode(
								JSON.stringify({
									type: 'gameJsonUri',
									name: 'helloworld',
									uri: 'https://akashic-games.github.io/demo/content/helloworld/game.json'
								})
							)
						},
						query: {
							autoplay: null
						}
					}"
					>Hello World</router-link
				>
			</li>
			<li>
				<router-link
					:to="{
						name: 'sample',
						params: {
							base64_uri_params: encode(
								JSON.stringify({
									type: 'gameJsonUri',
									name: 'GalaxyWars',
									uri: 'https://akashic-games.github.io/demo/content/GalaxyWars/game.json'
								})
							)
						},
						query: {
							autoplay: null
						}
					}"
					>GalaxyWars</router-link
				>
			</li>
			<li>
				<router-link
					:to="{
						name: 'sample',
						params: {
							base64_uri_params: encode(
								JSON.stringify({
									type: 'gameJsonUri',
									name: 'HoppingWitch',
									uri: 'https://akashic-games.github.io/demo/content/HoppingWitch/game.json'
								})
							)
						},
						query: {
							autoplay: null,
							nodl: null
						}
					}"
					>HoppingWitch (DLボタン非表示)</router-link
				>
			</li>
			<li>
				<router-link
					:to="{
						name: 'sample',
						params: {
							base64_uri_params: encode(
								JSON.stringify({
									type: 'gameJsonUri',
									name: 'cannontv',
									uri: 'https://akashic-games.github.io/demo/content/cannontv/game.json'
								})
							)
						},
						query: {
							autoplay: null
						}
					}"
					>いくぜ！ 超会議</router-link
				>
			</li>
			<li>
				<router-link
					:to="{
						name: 'sample',
						params: {
							base64_uri_params: encode(
								JSON.stringify({
									type: 'gameJsonUri',
									name: 'kisoe-nariagari-dungeon',
									uri: 'https://akashic-games.github.io/demo/content/kisoe-nariagari-dungeon/game.json'
								})
							)
						},
						query: {
							autoplay: null
						}
					}"
					>【ツクールMV製】競え！成り上がりダンジョン</router-link
				>
			</li>
			<li>
				<router-link
					:to="{
						name: 'sample',
						params: {
							base64_uri_params: encode(
								JSON.stringify({
									type: 'gameJsonUri',
									name: 'demo-touchevent',
									uri: 'https://akashic-games.github.io/demo/content/demo-touchevent/game.json'
								})
							)
						},
						query: {
							noEditor: null
						}
					}"
					>タッチイベント (エディタ非表示)</router-link
				>
			</li>
		</ul>
		<h2>Snippet</h2>
		<ul>
			<li>
				<router-link
					:to="{
						name: 'snippet',
						params: {
							base64_uri_params: encode(
								JSON.stringify({
									type: 'gameJsonUri',
									name: 'helloworld',
									uri: 'https://akashic-games.github.io/demo/content/helloworld/game.json'
								})
							)
						}
					}"
					>Hello World</router-link
				>
			</li>
			<li>
				<router-link
					:to="{
						name: 'snippet',
						params: {
							base64_uri_params: encode(
								JSON.stringify({
									type: 'gameJsonUri',
									name: 'helloworld',
									uri: 'https://akashic-games.github.io/demo/content/helloworld/game.json'
								})
							)
						},
						query: {
							autoplay: null
						}
					}"
					>Hello World (autoplay)</router-link
				>
			</li>
			<li>
				<router-link
					:to="{
						name: 'snippet',
						params: {
							base64_uri_params: encode(
								JSON.stringify({
									type: 'gameJsonUri',
									name: 'helloworld',
									uri: 'https://akashic-games.github.io/demo/content/helloworld/game.json'
								})
							)
						},
						query: {
							autoplay: null,
							notab: null,
							nodl: null
						}
					}"
					>Hello World (autoplay, タブ &amp; DLボタン非表示)</router-link
				>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { encode } from "~/utils/Base64";
</script>
