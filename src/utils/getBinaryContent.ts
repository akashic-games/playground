export async function getBinaryContent(url: string) {
	return await (await fetch(url)).arrayBuffer();
}
