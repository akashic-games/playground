import * as path from "path";

// NOTE: path-browserify の一部の関数 (resolve() など) で process へのアクセスが発生する箇所があるため、一部の関数を簡易的に Polyfill している
export function resolve(from: string, to: string): string {
	const resolvedUrl = new URL(to, new URL(from, "resolve://"));
	if (resolvedUrl.protocol === "resolve:") {
		// `from` is a relative URL.
		const { pathname, search, hash } = resolvedUrl;
		return pathname + search + hash;
	}
	return resolvedUrl.toString();
}

export function dirname(url: string): string {
	return path.dirname(url);
}

export function basename(url: string): string {
	return path.basename(url);
}

export function extname(url: string): string {
	return path.extname(url);
}
