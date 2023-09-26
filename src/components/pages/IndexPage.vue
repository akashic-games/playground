<template>
	<div>
		<h2>Playground</h2>
		<ul>
			<li>
				<router-link
					:to="{
						name: 'edit',
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
						name: 'edit',
						params: {
							base64_uri_params: encode(
								JSON.stringify({
									type: 'gameJsonUri',
									name: 'oekaki',
									uri: 'https://akashic-games.github.io/demo/content/oekaki/game.json'
								})
							)
						}
					}"
					>おえかき</router-link
				>
			</li>
			<li>
				<router-link
					:to="{
						name: 'edit',
						params: {
							base64_uri_params: encode(
								JSON.stringify({
									type: 'gameJsonUri',
									name: 'newtons-cradle',
									uri: 'https://akashic-games.github.io/demo/content/newtons-cradle/game.json'
								})
							)
						},
						query: { nodl: null }
					}"
					>ニュートンのゆりかご (DLボタン非表示)</router-link
				>
			</li>
			<li>
				<router-link
					:to="{
						name: 'edit',
						params: {
							base64_uri_params: encode(
								JSON.stringify({
									type: 'gameJsonUri',
									name: 'monban',
									uri: 'https://akashic-games.github.io/demo/content/monban/game.json'
								})
							)
						}
					}"
					>門番</router-link
				>
			</li>
		</ul>
		<h2>Playground (presets)</h2>
		<ul>
			<li>
				<router-link :to="{ name: 'preset', params: { name: 'default' } }">default</router-link>
			</li>
			<li>
				<router-link :to="{ name: 'preset', params: { name: 'timeline' } }">timeline</router-link>
			</li>
			<li><router-link :to="{ name: 'preset', params: { name: 'label' } }">label</router-link></li>
			<li>
				<router-link :to="{ name: 'preset', params: { name: 'box2d' }, query: { nodl: null } }">box2d (DLボタン非表示)</router-link>
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
							nodl: null
						}
					}"
					>HoppingWitch (DLボタン非表示 &amp; 自動開始なし)</router-link
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
		<h2>Download</h2>
		<ul>
			<li>
				<router-link
					target="_blank"
					:to="{
						name: 'download',
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
					target="_blank"
					:to="{
						name: 'download',
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
							autoStart: null
						}
					}"
					>Hello World (auto start)</router-link
				>
			</li>
			<li>
				<router-link
					target="_blank"
					:to="{
						name: 'download',
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
							autoStart: null,
							autoClose: null
						}
					}"
					>Hello World (auto start &amp; close window)</router-link
				>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { encode } from "~/utils/Base64";
</script>
