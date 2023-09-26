import urlJoin from "url-join";
import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { UriParameter } from "./types/UriParameter";
import App from "~/components/pages/RootPage.vue";
import { decode } from "~/utils/Base64";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			name: "index",
			component: () => import("~/components/pages/IndexPage.vue")
		},
		{
			path: "/edit/:name/",
			name: "edit",
			component: () => import("~/components/pages/PlaygroundPage.vue"),
			props: router => {
				const gameJsonUri = urlJoin(
					`${window.location.protocol}//${window.location.host}`,
					window.location.pathname === "/" ? "" : window.location.pathname, // FIXME: 修正
					`presets/${router.params.name}/game.json`
				);
				return {
					gameJsonUri,
					name: router.params.name,
					showDownloadButton: router.query.nodl !== null // download ボタンを非表示化 (query の初期値は null)
				};
			}
		},
		{
			path: "/samples/:base64_uri_params",
			name: "sample",
			component: () => import("~/components/pages/SamplePage.vue"),
			props: router => {
				const params: UriParameter = JSON.parse(decode(router.params.base64_uri_params.toString()));
				if (params.type !== "gameJsonUri") {
					throw new Error("Parse Error: unknown uri parameter");
				}
				return {
					name: params.name ?? "noname",
					gameJsonUri: params.uri,
					autoplay: router.query.autoplay === null, // ?autoplay を解釈する (query の初期値は null)
					showDownloadButton: router.query.nodl !== null, // download ボタンを非表示化 (query の初期値は null)
					showEditor: router.query.noEditor !== null // エディタを非表示化 (query の初期値は null)
				};
			}
		},
		{
			path: "/snippets/:base64_uri_params",
			name: "snippet",
			component: () => import("~/components/pages/SnippetPage.vue"),
			props: router => {
				const params: UriParameter = JSON.parse(decode(router.params.base64_uri_params.toString()));
				if (params.type !== "gameJsonUri") {
					throw new Error("Parse Error: unknown uri parameter");
				}
				const autoplay = router.query.autoplay === null;
				const showDownloadButton = router.query.nodl !== null;
				const showTab = router.query.notab !== null; // タブを非表示化 (query の初期値は null)
				return {
					name: params.name ?? "noname",
					gameJsonUri: params.uri,
					autoplay,
					showDownloadButton,
					showTab
				};
			}
		}
	]
});

const app = createApp(App);
app.use(router);
app.mount("#app");
